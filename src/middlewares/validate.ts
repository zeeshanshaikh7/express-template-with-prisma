import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

/**
 * Validates req.body / req.params / req.query against a Zod schema.
 * Schema shape: z.object({ body: z.object({...}), params: z.object({...}), query: z.object({...}) })
 */
export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        sendError(res, 'Validation failed', 422, err.flatten().fieldErrors);
        return;
      }
      next(err);
    }
  };
