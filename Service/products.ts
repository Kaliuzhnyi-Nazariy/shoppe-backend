import { ensureProductExists, errorHandler } from "../helpers";
import { IAddProduct, IProduct } from "../interfaces/products";
import { prisma } from "../lib/prisma";

const getProducts = async () => {
  return prisma.product.findMany();
};

const getProductById = async (productId: string) => {
  return prisma.product.findUnique({ where: { id: productId } });
};

const addProducts = async (data: IAddProduct) => {
  const {
    title,
    amount,
    description,
    isArchived = false,
    price,
    additionalInformation = "",
    photos = [],
  } = data;

  const res = await prisma.product.create({
    data: {
      title,
      amount,
      description,
      isArchived,
      price,
      additionalInformation,
      photos,
    },
  });

  return res;
};

const updateProduct = async ({
  productId,
  data,
}: {
  productId: string;
  data: IProduct;
}) => {
  const product = await ensureProductExists(productId);

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...data,
      rate: product.rate,
    },
  });

  return updatedProduct;
};

const updateProductAmount = async (
  productId: string,
  productNumber: number,
) => {
  const product = await ensureProductExists(productId);

  await prisma.product.update({
    where: { id: productId },
    data: { ...product, amount: productNumber },
  });
};

const archiveProduct = async (productId: string) => {
  const product = await ensureProductExists(productId);

  await prisma.product.update({
    where: { id: productId },
    data: { ...product, isArchived: true },
  });
};

const deleteProduct = async (productId: string) => {
  await ensureProductExists(productId);

  await prisma.product.delete({
    where: { id: productId },
  });
};

export default {
  getProducts,
  getProductById,
  addProducts,
  updateProduct,
  updateProductAmount,
  archiveProduct,
  deleteProduct,
};
