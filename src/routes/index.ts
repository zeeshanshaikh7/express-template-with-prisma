import { Router } from "express";
import { container } from "../core/container";
import { createAuthRoutes } from "../modules/auth/auth.routes";

const router = Router();

router.use("/auth", createAuthRoutes(container.authController));

export default router;