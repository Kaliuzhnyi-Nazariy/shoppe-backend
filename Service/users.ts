import { UpdateUser } from "../interfaces/user";
import { prisma } from "../lib/prisma";
import { ensureExists, errorHandler } from "../helpers";
import bcrypt from "bcryptjs";
import { Prisma } from "../generated/prisma";

const getUser = async (userId: string) => {
  const res = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });

  if (!res) throw errorHandler(404, "User is not found");

  return res;

  // return await ensureExists({
  //   model: prisma.user,
  //   where: { id: userId },
  //   entityName: "User",
  // });

  // return await prisma.user.findUnique({ where: { id: userId } });
};

const updateUser = async ({
  id,
  firstName,
  lastName,
  displayName,
  email,
  password,
}: UpdateUser) => {
  await ensureExists({
    model: prisma.user,
    where: { id },
    entityName: "User",
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        displayName,
        email,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw errorHandler(409, "Email already in use");
    }

    throw error;
  }
};

const deleteUser = async (userId: string) => {
  try {
    await ensureExists({
      model: prisma.user,
      where: { id: userId },
      entityName: "User",
    });

    await prisma.user.delete({ where: { id: userId } });
  } catch (error) {
    throw error;
  }
};

export default {
  getUser,
  updateUser,
  deleteUser,
};
