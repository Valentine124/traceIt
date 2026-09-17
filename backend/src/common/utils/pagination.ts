import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export function toSkipTake(p: PaginationParams): { skip: number; take: number } {
  return { skip: (p.page - 1) * p.pageSize, take: p.pageSize };
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  p: PaginationParams,
): { items: T[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } } {
  return {
    items,
    pagination: {
      page: p.page,
      pageSize: p.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / p.pageSize)),
    },
  };
}
