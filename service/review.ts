import { Prisma } from "../generated/prisma";
import { ensureExists, errorHandler } from "../helpers";
import { prisma } from "../lib/prisma";

export interface IAddReview {
  productId: string;
  userId: string;
  comment: string;
  rating: number;
}

export type UpdateReview = Omit<IAddReview, "rating">;

const checkIfExist = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  await ensureExists({
    model: prisma.product,
    where: { id: productId },
    entityName: "Product",
  });

  await ensureExists({
    model: prisma.user,
    where: { id: userId },
    entityName: "User",
  });
};

const getReviews = async (productId: string) => {
  return await prisma.review.findMany({ where: { productId } });
};

const addReview = async ({
  productId,
  userId,
  rating,
  comment,
}: IAddReview) => {
  await checkIfExist({ userId, productId });

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          productId,
          userId,
          rating,
          comment,
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
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code == "P2002") {
      throw errorHandler(409, "Review already exists");
    } else {
      throw error;
    }
  }
};

const updateReview = async ({ productId, userId, comment }: UpdateReview) => {
  try {
    return await prisma.review.update({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
      data: {
        comment,
      },
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
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  await checkIfExist({ userId, productId });

  const review = await ensureExists({
    model: prisma.review,
    where: {
      productId_userId: {
        productId,
        userId,
      },
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
};

export default {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
};
