import { Response, NextFunction } from "express";
import { errorHandler } from "../helpers";
import type { CustomRequest } from "../interfaces/customRequest";

export const authorize =
  (allowedRoles: string[]) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(errorHandler(401));

    if (!allowedRoles.includes(req.user.role)) {
      return next(errorHandler(403));
    }

    next();
  };

// export default { authorize };
