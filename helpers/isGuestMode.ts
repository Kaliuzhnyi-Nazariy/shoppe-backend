import { Request } from "express";
import { jwtVerify } from "jose";
import errorHandler from "./errorHandler";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw errorHandler(500, "No jwt secret");
}

export const isGuestMode = async (
  req: Request,
): Promise<{ id: string | null; role: "admin" | "customer" | null }> => {
  const token = req.headers.authorization;

  if (!token) return { id: null, role: null };

  const [bearer, tokenValue] = token.split(" ");

  if (bearer !== "Bearer") return { id: null, role: null };

  const secret = new TextEncoder().encode(JWT_SECRET);

  const { payload } = await jwtVerify(tokenValue, secret);

  const id: string | null = token ? (payload.id as string) : null;
  const role: "admin" | "customer" | null = token
    ? (payload.role as "admin" | "customer")
    : null;

  return { id, role };
};
