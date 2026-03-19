import { errorHandler } from "../helpers";
import { SignIn, SignUp } from "../interfaces/user";
import { sendEmail } from "../utils";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { jwtVerify } from "jose";

const { JWT_SECRET, JWT_SECRET_FOR_RESET_PASSWORD } = process.env;
const secret_for_change_password = new TextEncoder().encode(
  JWT_SECRET_FOR_RESET_PASSWORD!,
);

const signUp = async ({
  firstName,
  lastName,
  displayName,
  email,
  role,
  password,
}: SignUp): Promise<{ token: string }> => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) throw errorHandler(409, "Email is already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  // make request to db
  const res = await prisma.user.create({
    data: {
      firstName,
      lastName,
      displayName,
      email,
      password: hashedPassword,
      role,
    },
  });
  // create token and return it (token will contain role and id)

  const payload = {
    id: res.id, // new user id
    role: res.role, // new user role
  };

  const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: "24h" });

  return { token };
};

const signIn = async ({
  email,
  password,
}: // }: SignIn): Promise<{ token: string; role: "customer" | "admin" }> => {
SignIn): Promise<{ token: string }> => {
  // check if user is exist in db
  const isUser = await prisma.user.findUnique({ where: { email } });

  if (!isUser) throw errorHandler(404, "Invalid credentials");
  // compare passwords
  const isPasswordMatches = bcrypt.compare(password, isUser.password);

  if (!isPasswordMatches) {
    throw errorHandler(404, "Invalid credentials");
  }

  const payload = {
    id: isUser.id, // taken from user
    role: isUser.role, //also from user
  };

  const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: "24h" });

  return { token };
};

// const signOut = async (userId: string) => {};

const forgetPassword = async (email: string) => {
  // check if user exists in db
  const isUser = await prisma.user.findUnique({ where: { email } });

  if (!isUser) {
    // return;
    throw errorHandler(200, "If the email exists, we sent a reset link.");
  }

  const payload = {
    id: isUser.id,
  };

  const token = jwt.sign(payload, JWT_SECRET_FOR_RESET_PASSWORD!, {
    expiresIn: "15min",
  });

  const hashedToken = await bcrypt.hash(token, 10);

  // const token = uuidv4();

  // const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const userFullName = isUser.firstName + " " + isUser.lastName;
  // await sendEmail({ email: isUser.email, name: userFullName });

  // add to reset_tokens db

  return { token };
};

const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string,
) => {
  // verify token (get user id)

  let userId;

  try {
    const { payload } = await jwtVerify(token, secret_for_change_password);
    userId = payload.id;
  } catch (error) {
    throw errorHandler(400, "Token is not valid");
  }

  if (!userId || typeof userId !== "string") throw errorHandler(404);

  const hashedPassword = await bcrypt.hash(confirmPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // delete from reset_passwords_db the row

  return;
};

export default {
  signUp,
  signIn,
  // signOut,
  forgetPassword,
  resetPassword,
};
