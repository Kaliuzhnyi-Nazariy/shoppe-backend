import { jwtVerify } from "jose";
import errorHandler from "./errorHandler";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw errorHandler(500, "No jwt secret in verify");
}

export const verifyTokenHelper = async (
  token: string,
): Promise<string | null> => {
  const [bearer, tokenValue] = token.split(" ");

  if (bearer !== "Bearer") return null;

  const secret = new TextEncoder().encode(JWT_SECRET);

  const { payload } = await jwtVerify(tokenValue, secret);

  return payload.id as string;
};
