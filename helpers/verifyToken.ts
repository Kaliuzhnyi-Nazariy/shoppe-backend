import { jwtVerify } from "jose";

const { JWT_SECRET } = process.env;

export const verifyTokenHelper = async (
  token: string,
): Promise<string | null> => {
  const [bearer, tokenValue] = token.split(" ");

  if (bearer !== "Bearer") return null;

  console.log({ tokenValue });

  const secret = new TextEncoder().encode(JWT_SECRET!);

  const { payload } = await jwtVerify(tokenValue, secret);

  return payload.id as string;
};
