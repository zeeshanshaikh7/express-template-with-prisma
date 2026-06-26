import { env } from './config/env';
import { createApp } from './app';
import { prisma } from './config/prisma';
import { appLogger } from './config/logger';

const app = createApp();

const start = async () => {
  try {
    // Verify DB connection on startup
    await prisma.$connect();
    appLogger.info("Database connected")

    app.listen(env.PORT, () => {
      appLogger.info(`School ERP API running on http://localhost:${env.PORT}`)
      appLogger.info(`Environment : ${env.NODE_ENV}`)
      appLogger.info(`Health check: http://localhost:${env.PORT}/health`)
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal: string) => {
  appLogger.info(`\n${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
