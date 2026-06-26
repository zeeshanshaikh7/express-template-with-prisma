import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { Logger } from "pino";

export class AuthController {
  constructor(
    private logger: Logger,
    private authService: AuthService
  ) { }

  me = async (req: Request, res: Response) => {
    const user = await this.authService.me(
      req.body.email,
    );

    res.json(user);
  };

  findUserById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await this.authService.findUserById(id);

    this.logger.info({ user }, "User found")

    res.json(user);
  };
}