import { ensureExists, errorHandler } from "../helpers";
import { AddCartItem } from "../interfaces/cart";
import { IAddProduct } from "../interfaces/products";
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

// const addMany = async (userId: string, products: AddCartItem[]) => {
// const cart = await ensureExists({
//   model: prisma.cart,
//   where: { userId },
//   entityName: "Cart",
// });

//   const cartItems = await prisma.cartItem.findMany({
//     where: { cartId: cart.id },
//   });

//   const productIds = products.map((p) => p.productId);

//   const DBProductsData = [];

//   for (let i = 0; i <= productIds.length - 1; i++) {
//     const DBProduct = await prisma.product.findUnique({
//       where: { id: productIds[i] },
//       select: { id: true, amount: true, price: true },
//     });

//     DBProductsData.push(DBProduct);
//   }

//   console.log({ DBProductsData });

//   const existingItems = [];

//   for (let i = 0; i < DBProductsData.length; i++) {
//     const existingItem = await prisma.cartItem.findUnique({
//       where: {
//         cartId_productId: {
//           cartId: cart.id,
//           productId: DBProductsData[i]?.id || "",
//         },
//       },
//     });

//     if (existingItem) {
//       existingItems.push(existingItem);
//     }
//   }

//   console.log({ existingItems });

//   // if (existingItems.length > 0) {
//   //   for (let i = 0; i < existingItems.length; i++) {
//   //     const product = products.find((prod) => {
//   //       return prod.productId == (existingItems[i]?.id as { id: string });
//   //     }) as unknown as { id: string; quantity: number };

//   //     const totalQuantity =
//   //       (existingItems[i]?.quantity || 0) + product.quantity;

//   //     const amountProductHas =
//   //       DBProductsData &&
//   //       DBProductsData.find((prod) => prod && prod.id === existingItems[i]?.id);

//   //     if (totalQuantity > productDB.amount) {
//   //       throw errorHandler(400, "Not enough stock");
//   //     }
//   //   }
//   // }

//   const res = [];

//   for (let i = 0; i < products.length; i++) {
//     const productFromDbData = DBProductsData.find(
//       (dbprod) => dbprod?.id == products[i].productId,
//     );

//     const newCartItem = await prisma.cartItem.upsert({
//       where: {
//         cartId_productId: { cartId: cart.id, productId: products[i].productId },
//       },
//       update: { quantity: { increment: products[i].quantity } },
//       create: {
//         cartId: cart.id,
//         productId: products[i].productId,
//         quantity: products[i].quantity,
//         price: productFromDbData?.price || 0,
//         userId: userId,
//       },
//     });
//     res.push(newCartItem);
//   }

//   return res;
// };

const addMany = async (userId: string, products: AddCartItem[]) => {
  const cart = await ensureExists({
    model: prisma.cart,
    where: { userId },
    entityName: "Cart",
  });

  const productIds = products.map((p) => p.productId);

  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, amount: true, price: true },
  });

  const existingItems = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
      productId: { in: productIds },
    },
  });

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));
  const existingMap = new Map(existingItems.map((i) => [i.productId, i]));

  const operations = products.map((p) => {
    const dbProduct = productMap.get(p.productId);

    if (!dbProduct) throw errorHandler(404, "Product is not found");

    const existing = existingMap.get(p.productId);
    const totalQuantity = (existing?.quantity || 0) + p.quantity;

    if (totalQuantity > dbProduct.amount) {
      throw errorHandler(400, "Not enough stock");
    }

    return prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: p.productId,
        },
      },
      update: {
        quantity: { increment: p.quantity },
      },
      create: {
        cartId: cart.id,
        productId: p.productId,
        quantity: p.quantity,
        price: dbProduct.price,
        userId,
      },
    });
  });

  return prisma.$transaction(operations);
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  removeItemFromCart,
  cleanCart,
  deleteCart,
  addMany,
};
