import { ensureExists, errorHandler } from "../helpers";
import { SignIn, SignUp, SignUpCheckout } from "../interfaces/user";
import { sendEmail } from "../utils";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { jwtVerify } from "jose";
import { verifyTokenHelper } from "../helpers/verifyToken";

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
      isPasswordSet: true,
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
  const isPasswordMatches = await bcrypt.compare(password, isUser.password);

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
    throw errorHandler(200, "If the email exists, we sent a reset link.");
  }

  const isRequest = await prisma.passwordResetTokens.findUnique({
    where: { userId: isUser.id },
  });

  if (isRequest) {
    await prisma.passwordResetTokens.delete({
      where: {
        userId: isRequest.userId,
        id: isRequest.id,
      },
    });
  }

  const payload = {
    id: isUser.id,
  };

  const token = jwt.sign(payload, JWT_SECRET_FOR_RESET_PASSWORD!, {
    expiresIn: "15min",
  });

  const hashedToken = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetTokens.create({
    data: {
      token: hashedToken,
      userId: isUser.id,
      expiresAt,
    },
  });

  const userFullName = isUser.firstName + " " + isUser.lastName;
  await sendEmail({
    email: isUser.email,
    name: userFullName,
    // token
  });

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

  const isRequest = await prisma.passwordResetTokens.findUnique({
    where: { userId },
  });

  if (!isRequest || isRequest.token === null)
    throw errorHandler(404, "Token is not found");

  const isThatUsersToken = await bcrypt.compare(token, isRequest.token);

  if (!isThatUsersToken) throw errorHandler(403, "It is not your token");

  const hashedPassword = await bcrypt.hash(confirmPassword, 10);

  await prisma.user
    .update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
    .then(async () => {
      await prisma.passwordResetTokens.delete({ where: { userId } });
    });

  return;
};

const createCheckoutUser = async ({
  email,
  displayName,
  lastName,
  firstName,
  password,
}: SignUp) => {
  const isUser = await prisma.user.findUnique({ where: { email } });
  let idToResetPassword;

  if (isUser)
    throw errorHandler(409, "User with that credentials already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      displayName,
      email,
      password: hashedPassword,
    },
  });

  if (!user) throw errorHandler(500, "Sth went wrong");

  const isTokenExist = await prisma.passwordResetTokens.findUnique({
    where: { userId: user.id },
  });

  try {
    if (isTokenExist) {
      await prisma.passwordResetTokens.delete({
        where: { id: isTokenExist.id, userId: user.id },
      });
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    const { id: resetPasswordId } = await prisma.passwordResetTokens.create({
      data: {
        userId: user.id,
        // token: hashedPasswordToken,
        expiresAt,
      },
    });

    idToResetPassword = resetPasswordId;

    try {
      sendEmail({
        email,
        name: firstName + " " + lastName,
        token: resetPasswordId,
      });
    } catch (error) {
      throw errorHandler(500, "sth went wrong");
    }
  } catch (error) {
    console.log(error);

    if (isTokenExist) {
      await prisma.passwordResetTokens.create({
        data: isTokenExist,
      });
    }
  }

  const payloadUser = {
    id: user.id,
    role: user.role,
  };

  const token = jwt.sign(payloadUser, JWT_SECRET!, { expiresIn: "24h" });

  return { token, idToResetPassword };
};

const setPassword = async ({
  // userId,
  tokenId,
  password,
}: {
  // userId: string;
  tokenId: string;
  password: string;
}) => {
  const isRequest = await prisma.passwordResetTokens.findUnique({
    where: { id: tokenId },
  });

  if (!isRequest) throw errorHandler(404, "Request is not found");

  const { expiresAt } = isRequest;

  if (expiresAt.getTime() <= new Date(Date.now()).getTime()) {
    try {
      await prisma.passwordResetTokens
        .delete({
          where: { id: tokenId },
        })
        .then(() => {
          return "Token is expired";
        });
    } catch (error) {
      throw errorHandler(500, "sth went wrong");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user
      .update({
        where: { id: isRequest.userId },
        data: {
          password: hashedPassword,
          isPasswordSet: true,
        },
      })
      .then(
        async () =>
          await prisma.passwordResetTokens.delete({
            where: { id: isRequest.id, userId: isRequest.userId },
          }),
      );
  } catch (error) {
    console.error(error);
    throw errorHandler(500, "Sth went wrong");
  }

  return;
};

const askResetPassword = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw errorHandler(404, "User is not found");

  const isRequest = await prisma.passwordResetTokens.findUnique({
    where: { userId },
  });

  if (isRequest) {
    await prisma.passwordResetTokens.delete({
      where: { id: isRequest.id, userId: isRequest.userId },
    });
  }

  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  const { id } = await prisma.passwordResetTokens.create({
    data: { expiresAt, userId },
  });

  try {
    await sendEmail({
      email: user.email,
      name: user.firstName + " " + user.lastName,
      token: id,
    });

    console.log("after send: ", {
      email: user.email,
      name: user.firstName + " " + user.lastName,
      token: id,
    });
  } catch (error) {
    console.error(error);
    throw errorHandler(500, "Email is not sent, because of internal error");
  }

  return;
};

// dev

const getAllRequestsToChangePassword = async () => {
  return await prisma.passwordResetTokens.findMany();
};

const allUsers = async () => {
  // await prisma.payment.deleteMany();
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.address.deleteMany();
  // await prisma.passwordResetTokens.deleteMany();
  // await prisma.cartItem.deleteMany();
  // await prisma.cart.deleteMany();
  // await prisma.user.deleteMany();
  return await prisma.user.findMany();
};

export default {
  signUp,
  signIn,
  // signOut,
  forgetPassword,
  resetPassword,
  createCheckoutUser,
  setPassword,
  askResetPassword,
  getAllRequestsToChangePassword,
  allUsers,
};
