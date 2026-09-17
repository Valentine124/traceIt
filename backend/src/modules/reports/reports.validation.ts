import { z } from 'zod';
import { ReportStatus, ReportVisibility, Language } from '@prisma/client';
import { paginationSchema } from '../../common/utils/pagination';

export const createReportSchema = z.object({
  projectId: z.string().uuid().optional(),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  visibility: z.nativeEnum(ReportVisibility).default(ReportVisibility.PROTECTED),
  language: z.nativeEnum(Language).default(Language.EN),
  // Only used when visibility is PROTECTED and the reporter is unauthenticated
  // (e.g. via USSD) — never stored on the Report row itself.
  contactPhone: z.string().optional(),
});

export const updateReportStatusSchema = z.object({
  status: z.nativeEnum(ReportStatus),
  note: z.string().max(1000).optional(),
});

export const listReportsQuerySchema = paginationSchema.extend({
  status: z.nativeEnum(ReportStatus).optional(),
  projectId: z.string().uuid().optional(),
});

export const trackReportSchema = z.object({
  trackingId: z.string().uuid(),
});
