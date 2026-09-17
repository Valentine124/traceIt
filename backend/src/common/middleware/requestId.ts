import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header('x-request-id');
  req.id = incoming && incoming.length <= 128 ? incoming : uuidv4();
  res.setHeader('x-request-id', req.id);
  next();
}
