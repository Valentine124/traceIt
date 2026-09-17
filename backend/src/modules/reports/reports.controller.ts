import { Request, Response, NextFunction } from 'express';
import * as reportsService from './reports.service';
import { paginationSchema } from '../../common/utils/pagination';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await reportsService.createReport(req.body, req.user?.sub);
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
}

export async function track(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await reportsService.trackReport(req.params.trackingId);
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await reportsService.getReportForReview(req.params.id);
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = paginationSchema.parse(req.query);
    const result = await reportsService.listReports(req.query as any, pagination);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await reportsService.updateReportStatus(
      req.params.id,
      req.body.status,
      req.body.note,
      req.user!.sub,
    );
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}
