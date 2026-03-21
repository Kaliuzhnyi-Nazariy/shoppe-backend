import { ensureExists, errorHandler } from "../helpers";
import { AddCartItem } from "../interfaces/cart";
import { prisma } from "../lib/prisma";

const getCart = async (userId: string) => {
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              description: true,
              photos: true,
              rate: true,
              reviewCount: true,
            },
          },
        },
        omit: { cartId: true, productId: true },
      },
    },
  });

  return { id: cart.id, items: cart.items };
  //   return prisma.cart.findUnique({ where: { userId } });
};

const addToCart = async ({
  userId,
  product,
}: {
  userId: string;
  product: AddCartItem;
}) => {
  if (product.quantity <= 0)
    throw errorHandler(400, "Quantity must be greater than 0");

  const { id } = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const productDB = await ensureExists({
    model: prisma.product,
    where: { id: product.productId },
    entityName: "Product",
  });

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: id,
        productId: product.productId,
      },
    },
  });

  const totalQuantity = (existingItem?.quantity || 0) + product.quantity;

  if (totalQuantity > productDB.amount) {
    throw errorHandler(400, "Not enough stock");
  }
  const newCartItem = await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: id, productId: product.productId },
    },
    update: { quantity: { increment: product.quantity } },
    create: {
      cartId: id,
      productId: product.productId,
      quantity: product.quantity,
      price: productDB.price,
      userId: userId,
    },
  });

  return newCartItem;
};

const removeFromCart = async ({
  userId,
  quantity,
  productId,
}: {
  userId: string;
  quantity: number;
  productId: string;
}) => {
  const cart = await ensureExists({
    model: prisma.cart,
    where: { userId },
    entityName: "Cart",
  });

  const item = await ensureExists({
    model: prisma.cartItem,
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    entityName: "Item",
  });

  if (quantity > item.quantity)
    throw errorHandler(400, "Quantity must be lower than you have in cart");

  if (item.quantity === quantity) {
    return await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
  } else {
    return prisma.cartItem.update({
      where: { id: item.id },
      data: {
        quantity: { decrement: quantity },
      },
    });
  }
};

const removeItemFromCart = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  const cart = await ensureExists({
    model: prisma.cart,
    where: { userId },
    entityName: "Cart",
  });

  const item = await ensureExists({
    model: prisma.cartItem,
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    entityName: "Item",
  });

  return await prisma.cartItem.delete({ where: { id: item.id } });
};

const cleanCart = async (userId: string) => {
  const cart = await ensureExists({
    model: prisma.cart,
    where: { userId },
    entityName: "Cart",
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  const res = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: true,
    },
  });

  return { items: res?.items };
};

const deleteCart = async (userId: string) => {
  const cart = await ensureExists({
    model: prisma.cart,
    where: { userId },
    entityName: "Cart",
  });

  await prisma.cart.delete({ where: { id: cart.id } });
  return;
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  removeItemFromCart,
  cleanCart,
  deleteCart,
};
