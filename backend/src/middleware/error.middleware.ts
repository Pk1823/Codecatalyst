import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status?: number;
  code?: string;
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    code: "NOT_FOUND",
  });
}

/**
 * Production-grade Global Error Handler
 */
export function globalErrorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  const code = err.code || "INTERNAL_ERROR";

  if (status >= 500) {
    console.error("[SERVER_EXCEPTION]:", err);
  }

  res.status(status).json({
    error: message,
    code,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}
