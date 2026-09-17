import { z } from 'zod';
import { ProjectCategory, ProjectStatus } from '@prisma/client';
import { paginationSchema } from '../../common/utils/pagination';

export const createProjectSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.nativeEnum(ProjectCategory),
  country: z.string().min(2).max(100),
  region: z.string().max(100).optional(),
  community: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  budgetAmount: z.number().positive().optional(),
  budgetCurrency: z.string().length(3).optional(), // ISO 4217
  contractor: z.string().max(200).optional(),
  responsibleOrgId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  expectedCompletion: z.coerce.date().optional(),
  deliverables: z.array(z.string().max(300)).max(50).default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

export const updateProjectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatus),
  note: z.string().max(1000).optional(),
});

export const listProjectsQuerySchema = paginationSchema.extend({
  category: z.nativeEnum(ProjectCategory).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  community: z.string().optional(),
  search: z.string().max(200).optional(),
  sortBy: z.enum(['createdAt', 'name', 'startDate', 'budgetAmount']).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

export const projectIdParamSchema = z.object({ id: z.string().uuid() });
