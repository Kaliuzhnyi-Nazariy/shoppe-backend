import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json(errors);
    }

    req.body = result.data;
    next();
  };

export default validateBody;
