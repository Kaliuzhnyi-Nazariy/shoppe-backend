import { prisma } from "../lib/prisma";
import errorHandler from "./errorHandler";

export const ensureProductExists = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw errorHandler(404, "Product is not found");

  return product;
};
