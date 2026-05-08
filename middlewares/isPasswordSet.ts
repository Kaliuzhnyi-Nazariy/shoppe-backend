import { NextFunction, Response } from "express";
import { errorHandler } from "../helpers";
import { CustomRequest } from "../interfaces/customRequest";
import { prisma } from "../lib/prisma";

export const isPasswordSetMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) return next(errorHandler(404, "Invalid credentials"));

  if (user.isPasswordSet) {
    next();
  } else {
    return next(errorHandler(403, "Finish account setup"));
  }
};
