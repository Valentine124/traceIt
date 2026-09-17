import { ReportVisibility } from '@prisma/client';
import { prisma } from '../../database/prisma';
import { ForbiddenError, NotFoundError } from '../../common/errors/AppError';
import { recordAuditEvent } from '../audit/audit.service';
import { enqueueNotification } from '../notifications/notification.service';
import { PaginationParams, toSkipTake, paginatedResponse } from '../../common/utils/pagination';

interface CreateReportInput {
  projectId?: string;
  title: string;
  description: string;
  visibility: ReportVisibility;
  language: string;
  contactPhone?: string;
}

/**
 * Anonymity is architectural, not a display flag: for ANONYMOUS reports we
 * never write a ReportIdentity row at all — there is nothing in the schema
 * to leak, by construction, regardless of future query/serialization bugs.
 */
export async function createReport(input: CreateReportInput, userId?: string) {
  const report = await prisma.report.create({
    data: {
      projectId: input.projectId,
      title: input.title,
      description: input.description,
      visibility: input.visibility,
      language: input.language as any,
      statusHistory: { create: { status: 'RECEIVED' } },
      ...(input.visibility !== ReportVisibility.ANONYMOUS && (userId || input.contactPhone)
        ? {
            identity: {
              create: {
                userId,
                contactPhone: input.contactPhone,
              },
            },
          }
        : {}),
    },
  });

  await recordAuditEvent({
    actorId: userId,
    action: 'REPORT_CREATED',
    entityType: 'Report',
    entityId: report.id,
    // Never log title/description content in audit metadata (could contain
    // sensitive disclosures) — reference by id only.
  });

  if (input.visibility !== ReportVisibility.ANONYMOUS) {
    await enqueueNotification({
      userId,
      reportId: report.id,
      event: 'REPORT_CREATED',
      channel: 'SMS',
      payload: { trackingId: report.trackingId },
    });
  }

  // trackingId is the only thing safe to hand back to an anonymous reporter.
  return { id: report.id, trackingId: report.trackingId, status: report.status };
}

/** Public tracking lookup — returns status only, never content tied to identity. */
export async function trackReport(trackingId: string) {
  const report = await prisma.report.findFirst({
    where: { trackingId, deletedAt: null },
    select: {
      trackingId: true,
      status: true,
      createdAt: true,
      statusHistory: { orderBy: { changedAt: 'desc' }, select: { status: true, note: true, changedAt: true } },
    },
  });
  if (!report) throw new NotFoundError('Report');
  return report;
}

/** Full report view for verifiers/admins — never includes identity unless caller is authorized. */
export async function getReportForReview(id: string) {
  const report = await prisma.report.findFirst({
    where: { id, deletedAt: null },
    include: {
      statusHistory: { orderBy: { changedAt: 'desc' } },
      evidence: true,
      verificationReviews: true,
      institutionResponses: true,
      project: { select: { id: true, name: true } },
    },
  });
  if (!report) throw new NotFoundError('Report');
  return report;
}

export async function listReports(query: { status?: string; projectId?: string }, pagination: PaginationParams) {
  const where = {
    deletedAt: null,
    ...(query.status ? { status: query.status as any } : {}),
    ...(query.projectId ? { projectId: query.projectId } : {}),
  };
  const { skip, take } = toSkipTake(pagination);
  const [items, total] = await prisma.$transaction([
    prisma.report.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        trackingId: true,
        title: true,
        status: true,
        visibility: true,
        createdAt: true,
        projectId: true,
      },
    }),
    prisma.report.count({ where }),
  ]);
  return paginatedResponse(items, total, pagination);
}

export async function updateReportStatus(id: string, status: string, note: string | undefined, actorId: string) {
  const existing = await prisma.report.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError('Report');

  const [report] = await prisma.$transaction([
    prisma.report.update({ where: { id }, data: { status: status as any } }),
    prisma.reportStatusHistory.create({ data: { reportId: id, status: status as any, note, changedBy: actorId } }),
  ]);

  await recordAuditEvent({
    actorId,
    action: 'REPORT_STATUS_CHANGED',
    entityType: 'Report',
    entityId: id,
    metadata: { status },
  });

  if (existing.visibility !== ReportVisibility.ANONYMOUS) {
    await enqueueNotification({
      reportId: id,
      event: 'REPORT_STATUS_CHANGED',
      channel: 'SMS',
      payload: { status },
    });
  }

  return report;
}

/** Guards against IDOR: a reporter may only fetch their own report by internal id. */
export async function assertUserOwnsReport(reportId: string, userId: string): Promise<void> {
  const identity = await prisma.reportIdentity.findUnique({ where: { reportId } });
  if (!identity || identity.userId !== userId) {
    throw new ForbiddenError('You do not have access to this report');
  }
}
