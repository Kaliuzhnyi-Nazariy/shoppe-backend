import { NextFunction, Request, Response } from "express";

export const controllerWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => any,
) => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
  return func;
};
