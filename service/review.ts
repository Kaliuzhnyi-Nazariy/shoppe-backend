import { Prisma } from "@prisma/client";
// import { Prisma } from "../generated/prisma";
import { ensureExists, errorHandler } from "../helpers";
import { prisma } from "../lib/prisma";

import * as crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils";
import { IAddReview, UpdateReview } from "../interfaces/reviews";

const getReviews = async (productId: string) => {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { displayName: true },
      },
    },
  });
};

const addReview = async ({
  productId,
  email,
  name,
  rating,
  comment,
}: IAddReview) => {
  const user = await prisma.user.findUnique({ where: { email } });

  await ensureExists({
    model: prisma.product,
    where: { id: productId },
    entityName: "Product",
  });

  let userId = "";

  if (!user) {
    const password = crypto.randomBytes(20).toString("hex");

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const { id, firstName, lastName } = await tx.user.create({
        data: {
          email,
          displayName: name,
          firstName: name,
          lastName: "",
          password: hashedPassword,
          isPasswordSet: false,
        },
      });

      const isTokenExist = await tx.passwordResetTokens.findUnique({
        where: { userId: id },
      });

      if (isTokenExist) {
        await tx.passwordResetTokens.delete({
          where: { id: isTokenExist.id },
        });
      }

      const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

      const { id: idToResetPassword } = await tx.passwordResetTokens.create({
        data: {
          userId: id,
          expiresAt,
        },
      });

      try {
        sendEmail({
          email,
          name: firstName + " " + lastName,
          token: idToResetPassword,
        });
      } catch (error) {
        throw errorHandler(500, "sth went wrong");
      }

      userId = id;
    });
  } else {
    userId = user.id;
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        comment,
        rating,
        userId,
        productId,
      },
    });

    const stats = await tx.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        reviewCount: stats._count.rating,
        rate: stats._avg.rating ?? 0,
      },
    });
  });
};

const updateReview = async ({
  reviewId,
  userId,
  comment,
  rating,
}: UpdateReview) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const data = await tx.review.findUnique({
        where: { id: reviewId },
      });

      await tx.review.update({
        where: {
          userId,
          id: reviewId,
        },
        data: {
          comment,
          rating,
        },
      });

      const stats = await tx.review.aggregate({
        where: {
          productId: data?.productId,
        },
        _avg: { rating: true },
      });

      await tx.product.update({
        where: { id: data?.productId },
        data: {
          rate: stats._avg.rating ?? 0,
        },
      });
    });
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      throw errorHandler(404, "Review not found");
    }
    throw error;
  }
};

const deleteReview = async ({
  userId,
  reviewId,
}: {
  userId: string;
  reviewId: string;
}) => {
  await ensureExists({
    model: prisma.user,
    where: { id: userId },
    entityName: "User",
  });

  const review = await ensureExists({
    model: prisma.review,
    where: {
      id: reviewId,
      userId,
    },
    entityName: "Review",
  });

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: review.id } });

    const stats = await tx.review.aggregate({
      where: {
        productId: review.productId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await tx.product.update({
      where: { id: review.productId },
      data: {
        reviewCount: stats._count.rating,
        rate: stats._avg.rating ?? 0,
      },
    });
  });

  return review;
};

export default {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
};
