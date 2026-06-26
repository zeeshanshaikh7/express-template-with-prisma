import { Request, Response, NextFunction } from 'express';
import { sendForbidden } from '../utils/response';

/**
 * Role-based authorization middleware.
 * Usage: authorize('school_admin', 'accountant')
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      sendForbidden(res, 'Access denied');
      return;
    }

    if (!allowedRoles.includes(user.roleName)) {
      sendForbidden(res, `Role '${user.roleName}' is not allowed to access this resource`);
      return;
    }

    next();
  };
};

/**
 * Ensures the user is operating within their own school scope.
 * org_super_admin is exempt — they can access any school.
 */
export const scopeToSchool = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;
  const schoolId = req.params.schoolId || req.body?.schoolId;

  if (!user) {
    sendForbidden(res, 'Access denied');
    return;
  }

  // org_super_admin bypasses school scoping
  if (user.roleName === 'org_super_admin') {
    next();
    return;
  }

  if (schoolId && user.schoolId !== schoolId) {
    sendForbidden(res, 'Access to this school is not permitted');
    return;
  }

  next();
};
