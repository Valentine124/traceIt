import { Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma';
import { NotFoundError } from '../../common/errors/AppError';
import { PaginationParams, toSkipTake, paginatedResponse } from '../../common/utils/pagination';
import { recordAuditEvent } from '../audit/audit.service';
import { z } from 'zod';
import { createProjectSchema, updateProjectSchema, listProjectsQuerySchema } from './projects.validation';

type CreateProjectInput = z.infer<typeof createProjectSchema>;
type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

export async function createProject(input: CreateProjectInput, actorId?: string) {
  const project = await prisma.project.create({
    data: {
      ...input,
      statusHistory: { create: { status: 'PLANNED', changedBy: actorId } },
    },
  });
  await recordAuditEvent({
    actorId,
    action: 'PROJECT_CREATED',
    entityType: 'Project',
    entityId: project.id,
  });
  return project;
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findFirst({
    where: { id, deletedAt: null },
    include: {
      statusHistory: { orderBy: { changedAt: 'desc' }, take: 20 },
      sources: { include: { source: true } },
      responsibleOrg: { select: { id: true, name: true, isVerified: true } },
    },
  });
  if (!project) throw new NotFoundError('Project');
  return project;
}

export async function listProjects(query: ListProjectsQuery, pagination: PaginationParams) {
  const where: Prisma.ProjectWhereInput = {
    deletedAt: null,
    ...(query.category ? { category: query.category } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.country ? { country: query.country } : {}),
    ...(query.region ? { region: query.region } : {}),
    ...(query.community ? { community: query.community } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const { skip, take } = toSkipTake(pagination);
  const [items, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      skip,
      take,
      orderBy: { [query.sortBy]: query.sortDir } as Prisma.ProjectOrderByWithRelationInput,
    }),
    prisma.project.count({ where }),
  ]);

  return paginatedResponse(items, total, pagination);
}

export async function updateProject(id: string, input: UpdateProjectInput, actorId?: string) {
  const existing = await prisma.project.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError('Project');

  const project = await prisma.project.update({ where: { id }, data: input });
  await recordAuditEvent({ actorId, action: 'PROJECT_UPDATED', entityType: 'Project', entityId: id });
  return project;
}

export async function updateProjectStatus(id: string, status: string, note: string | undefined, actorId?: string) {
  const existing = await prisma.project.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError('Project');

  const [project] = await prisma.$transaction([
    prisma.project.update({ where: { id }, data: { status: status as any } }),
    prisma.projectStatusHistory.create({
      data: { projectId: id, status: status as any, note, changedBy: actorId },
    }),
  ]);
  await recordAuditEvent({
    actorId,
    action: 'PROJECT_STATUS_CHANGED',
    entityType: 'Project',
    entityId: id,
    metadata: { status, note },
  });
  return project;
}

export async function softDeleteProject(id: string, actorId?: string) {
  const existing = await prisma.project.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError('Project');

  await prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  await recordAuditEvent({ actorId, action: 'PROJECT_DELETED', entityType: 'Project', entityId: id });
}
