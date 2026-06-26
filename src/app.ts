import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // ─── Security headers ─────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ─────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.NODE_ENV === 'production' ? [] : '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ─── Request body parsing ─────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── HTTP logging ─────────────────────────────────────────────
  app.use(morgan(env.LOG_LEVEL));

  // ─── Global rate limiting ─────────────────────────────────────
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests, please try again later.' },
    })
  );

  // ─── Health check ─────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
  });

  // ─── API routes ───────────────────────────────────────────────
  app.use('/api', routes);

  // ─── 404 & Error handlers ─────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
