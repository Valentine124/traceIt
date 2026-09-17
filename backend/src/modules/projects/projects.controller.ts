import { Request, Response, NextFunction } from 'express';
import * as projectsService from './projects.service';
import { paginationSchema } from '../../common/utils/pagination';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectsService.createProject(req.body, req.user?.sub);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectsService.getProjectById(req.params.id);
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = paginationSchema.parse(req.query);
    const result = await projectsService.listProjects(req.query as any, pagination);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectsService.updateProject(req.params.id, req.body, req.user?.sub);
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectsService.updateProjectStatus(
      req.params.id,
      req.body.status,
      req.body.note,
      req.user?.sub,
    );
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await projectsService.softDeleteProject(req.params.id, req.user?.sub);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
