import { Request, Response, NextFunction } from 'express';

// TODO(AI/Backend): Check if authenticated user has required role (e.g., 'officer')
export function requireRole(role: string) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    // Stub: pass-through role check for boilerplate
    void role;
    next();
  };
}
