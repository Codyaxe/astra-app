import { Request, Response, NextFunction } from 'express';

// Minimal global error handler for unexpected errors and NotImplementedError
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
  });
}
