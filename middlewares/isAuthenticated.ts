import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../helpers";
import { jwtVerify } from "jose";
import { CustomRequest } from "../interfaces/customRequest";

const { JWT_SECRET } = process.env;
const secret = new TextEncoder().encode(JWT_SECRET!);

export const isAuthenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const cookies = req.cookies;

  const token = cookies["token"];

  if (!token) return next(errorHandler(401));

  // verify token and get id

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.id || !payload.role) return next(errorHandler(401));

    const tokenData: { id: string; role: "admin" | "customer" } = {
      id: payload.id as string,
      role: payload.role as "admin" | "customer",
    };

    // check in db is that user exist

    req.user = tokenData;

    next();
  } catch (error) {
    next(errorHandler(401));
  }
};
