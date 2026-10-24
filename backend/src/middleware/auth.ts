import { Request, Response, NextFunction } from 'express';

// TODO(AI/Backend): Validate Bearer token / Firebase session and populate req.user
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  // Stub: pass-through for boilerplate
  next();
}
