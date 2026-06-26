import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { sendError } from '../utils/response';
import { env } from '../config/env';
import createHttpError from 'http-errors';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    return void sendError(
      res,
      createHttpError.UnprocessableEntity("Validation failed"),
      err.flatten().fieldErrors
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return void sendError(
          res,
          createHttpError.Conflict("Record already exists")
        );

      case "P2025":
        return void sendError(
          res,
          createHttpError.NotFound("Record not found")
        );
    }
  }

  if (createHttpError.isHttpError(err)) {
    return void sendError(res, err);
  }

  console.error(err);

  return void sendError(
    res,
    createHttpError.InternalServerError(
      env.NODE_ENV === "development"
        ? (err as Error)?.message
        : "Internal server error"
    )
  );
};

/** Catch 404 routes */
export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    createHttpError.NotFound(
      `Route ${req.method} ${req.path} not found`
    )
  );
};
