import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, hashToken, JwtPayload } from '../utils/jwt';
import { prisma } from '../config/prisma';
import { sendUnauthorized } from '../utils/response';

// Extend Express Request to carry the decoded JWT payload
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'No token provided');
      return;
    }

    const rawToken = authHeader.split(' ')[1];
    const payload = verifyAccessToken(rawToken);

    // Verify session exists and is not expired in DB
    const tokenHash = hashToken(rawToken);
    const session = await prisma.session.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      sendUnauthorized(res, 'Session expired or invalid');
      return;
    }

    req.user = payload;
    next();
  } catch {
    sendUnauthorized(res, 'Invalid or expired token');
  }
};
