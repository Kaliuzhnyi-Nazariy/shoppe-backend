import { Request, Response, NextFunction } from "express";

export const notFoundRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({ message: "route not found" });
};
