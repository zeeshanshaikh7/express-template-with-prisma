import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import { env } from "./env";

const logDir = process.env.LOG_PATH || path.join(process.cwd(), "logs");

fs.mkdirSync(logDir, { recursive: true });

export const appLogger = pino({
    level: env.NODE_ENV === "production" ? "info" : "debug",
})

export const logger = pino({
    level: env.NODE_ENV === "production" ? "info" : "debug",

}, pino.destination({
    dest: path.join(logDir, "app.log"),
    sync: false,
}));


export class LoggerFactory {
    module(name: string) {
        return logger.child({ module: name });
    }
}

export const loggerFactory = new LoggerFactory();