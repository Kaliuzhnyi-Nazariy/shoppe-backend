import { Request, Response, NextFunction } from "express";
import type { CustomError } from "../interfaces/customError";

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { status = 500, message = "Server error" } = error;

  res.status(status).json({ message });
};
