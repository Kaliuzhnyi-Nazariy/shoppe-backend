import { Request } from "express";
// import { verifyTokenHelper } from "./verifyToken";
import { jwtVerify } from "jose";
import { JwtPayload } from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const isGuestMode = async (
  req: Request,
): Promise<{ id: string | null; role: "admin" | "customer" | null }> => {
  // ): Promise<{ id: string | null; role: "admin" | "customer" | null } | null> => {
  // ): Promise<{ id: string; role: "admin" | "customer" } | null> => {
  // export const isGuestMode = async (req: Request): Promise<JwtPayload | null> => {
  // export const isGuestMode = async (req: Request): Promise<string | null> => {
  const token = req.headers.authorization;

  // console.log({ token });

  if (!token) return { id: null, role: null };
  // if (!token) return null;

  const [bearer, tokenValue] = token.split(" ");

  if (bearer !== "Bearer") return { id: null, role: null };
  // if (bearer !== "Bearer") return null;

  const secret = new TextEncoder().encode(JWT_SECRET!);

  const { payload } = await jwtVerify(tokenValue, secret);

  const id: string | null = token ? (payload.id as string) : null;
  const role: "admin" | "customer" | null = token
    ? (payload.role as "admin" | "customer")
    : null;

  return { id, role };

  // return id;
};

// export const verifyTokenHelper = async (
//   token: string,
// ): Promise<string | null> => {

//   return payload.id as string;
// };
