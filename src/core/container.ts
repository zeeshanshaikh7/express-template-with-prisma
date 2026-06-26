import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";
import { prisma } from "../config/prisma";
import { loggerFactory } from "../config/logger";

const authLogger = loggerFactory.module("Authentication");
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authLogger, authService);

export const container = {
    authController,
};