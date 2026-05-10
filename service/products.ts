import {
  cloudinaryDelete,
  ensureProductExists,
  errorHandler,
  getProductWithPhotos,
} from "../helpers";
import { IAddProduct, IUpdateProduct } from "../interfaces/products";
import { prisma } from "../lib/prisma";

const getProducts = async (
  serach: string,
  lte: string,
  gte: string,
  stock: string,
  sort: string,
  data: { id: string | null; role: "admin" | "customer" | null },
) => {
  const numberLte = Number(lte);
  const numberGte = Number(gte);
  const stockBoolean = stock === "true";

  const orderBy = sort
    ? { [sort == "price" ? sort : "createdAt"]: "desc" }
    : {};
  return await prisma.product.findMany({
    include: { photos: true },
    where: {
      ...(serach
        ? {
            OR: [
              { title: { contains: serach, mode: "insensitive" } },
              { description: { contains: serach, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(data && data.role !== "admin" && { isArchived: false }),
      price: {
        ...(numberLte ? { lte: numberLte } : {}),
        ...(numberGte ? { gte: numberGte } : {}),
      },
      amount: { ...(stockBoolean ? { gt: 0 } : {}) },
    },
    orderBy: orderBy,
  });
};

const getProductById = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { photos: true },
  });

  if (product) {
    return product;
  } else {
    throw errorHandler(404, "Product is not found");
  }
};

const addProducts = async (data: IAddProduct) => {
  const {
    title,
    description,
    isArchived = false,
    price,
    additionalInformation = "",
    photos = [],
    amount = 0,
  } = data;

  const res = await prisma.product.create({
    data: {
      title,
      description,
      isArchived,
      price,
      additionalInformation,
      photos: {
        create: photos.map((photo) => ({
          id: photo.id,
          link: photo.link,
        })),
      },
      amount,
    },
  });

  return res;
};

const updateProduct = async ({
  productId,
  data,
}: {
  productId: string;
  data: IUpdateProduct;
}) => {
  const product = await getProductWithPhotos(productId);

  const {
    photos,
    additionalInformation,
    amount,
    description,
    isArchived,
    price,
    title,
    newPhotos,
  } = data;

  let photosForUpd: Photo[];

  const productPhotos = product.photos;

  if (Array.isArray(photos)) {
    const isInDb = photos.map(
      (p) =>
        productPhotos.filter(
          (pp: { link: string; id: string }) => pp.link == p,
        )[0],
    );
    photosForUpd = isInDb;
  } else {
    photosForUpd = productPhotos.filter(
      (pp: { link: string; id: string }) => pp.link === photos,
    );
  }

  const removedPhotos = product.photos.filter(
    (p: { link: string }) => !(photos ?? []).includes(p.link),
  );

  const idsToDelete = removedPhotos.map((p: { id: string }) => p.id);

  await cloudinaryDelete(idsToDelete);

  type Photo = { id: string; link: string };

  const listOfPhotos: Photo[] = [
    ...(photosForUpd ?? []),
    ...(newPhotos ?? []),
  ] as unknown as Photo[];

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      amount,
      description,
      isArchived,
      price,
      title,
      additionalInformation,
      photos: {
        deleteMany: {},
        create: listOfPhotos.map((photo) => ({
          id: photo.id,
          link: photo.link,
        })),
      },
      rate: product.rate,
    },
  });

  return updatedProduct;
};

const updateProductAmount = async (
  productId: string,
  productNumber: number,
) => {
  await ensureProductExists(productId);

  await prisma.product.update({
    where: { id: productId },
    data: { amount: productNumber },
  });
};

const archiveProduct = async (productId: string) => {
  const product = await ensureProductExists(productId);

  await prisma.product.update({
    where: { id: productId },
    data: { ...product, isArchived: !product.isArchived },
  });
};

const deleteProduct = async (productId: string) => {
  await ensureProductExists(productId);

  await prisma.product.delete({
    where: { id: productId },
  });
};

const getMinMaxPrice = async () => {
  return await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
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
  getMinMaxPrice,
};
