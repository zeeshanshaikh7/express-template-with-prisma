import { Router } from "express";
import { AuthController } from "./auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";

export function createAuthRoutes(controller: AuthController) {
  const router = Router();

  router.post("/me", asyncHandler(controller.me));

  router.get("/me/:id", asyncHandler(controller.findUserById));

  return router;
}