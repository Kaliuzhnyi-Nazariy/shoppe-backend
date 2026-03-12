export const cookieSettings = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 3 * 24 * 60 * 60 * 1000,
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax",
  path: "/",
};
