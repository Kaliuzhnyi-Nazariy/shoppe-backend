// customer

import { OrderStatus } from "@prisma/client";
import { errorHandler } from "../helpers";
import { PlaceOrderBody } from "../interfaces/order";
import { prisma } from "../lib/prisma";

const getMyOrders = async (userId: string) => {
  const data = await prisma.order.findMany({
    where: { buyerId: userId },
    include: {
      items: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

const getOrderById = async (
  orderdId: string,
  data: { id: string | null; role: string | null },
) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderdId,
      ...(data.role === "customer" && data.id
        ? { buyerId: data.id }
        : !data.id
        ? { buyerId: null }
        : {}),
    },
    include: {
      items: true,
      payment: true,
    },
  });

  return order;
};

const placeOrder = async ({
  userId,
  orderData,
}: {
  userId: string | null;
  orderData: PlaceOrderBody;
}) => {
  const order = prisma.$transaction(async (tx) => {
    for (const item of orderData.items) {
      const result = await tx.product.updateMany({
        where: {
          id: item.productId,
          amount: { gte: item.quantity },
        },
        data: {
          amount: {
            decrement: item.quantity,
          },
        },
      });

      if (result.count === 0) {
        throw errorHandler(400, "Not enough stock for product");
      }
    }

    const order = await tx.order.create({
      data: {
        buyerId: userId,
        buyerEmail: orderData.buyerEmail,
        contactNumber: orderData.contactNumber,
        totalPrice: orderData.totalPrice,
        paymentMethod: orderData.paymentMethod,
        billingFirstName: orderData.billingAddress.firstName,
        billingLastName: orderData.billingAddress.lastName,
        billingStreet: orderData.billingAddress.streetAddress,
        billingCity: orderData.billingAddress.city,
        billingPostcode: orderData.billingAddress.postcode,
        billingCountry: orderData.billingAddress.country,
        billingPhone: orderData.billingAddress.phone,
        billingEmail: orderData.billingAddress.email,
        shippingFirstName: orderData.shippingAddress.firstName,
        shippingLastName: orderData.shippingAddress.lastName,
        shippingStreet: orderData.shippingAddress.streetAddress,
        shippingCity: orderData.shippingAddress.city,
        shippingPostcode: orderData.shippingAddress.postcode,
        shippingCountry: orderData.shippingAddress.country,
        shippingPhone: orderData.shippingAddress.phone,
        shippingEmail: orderData.shippingAddress.email,
        items: {
          create: orderData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            productTitle: item.productTitle,
          })),
        },
        payment: {
          create: {
            method: orderData.paymentMethod,
            status: "pending",
            amount: orderData.totalPrice,
          },
        },
      },
    });
    return order;
  });

  return order;
};

const cancelOrder = async (orderId: string) => {
  const order = await prisma.$transaction(async (tx) => {
    const orderData = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!orderData) throw errorHandler(404, "order is not found");

    await Promise.all(
      orderData.items.map(
        (item: {
          id: string;
          orderId: string;
          productId: string;
          productTitle: string;
          quantity: number;
          price: number;
        }) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              amount: {
                increment: item.quantity,
              },
            },
          }),
      ),
    );

    if (orderData.status === "delivered" || orderData.status === "canceled")
      throw errorHandler(400, "Unable to change status");

    const updateOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: "canceled" },
    });

    return updateOrder;
  });

  return order;
};

// admin

const updateOrderStatus = async (orderId: string, status?: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) throw errorHandler(404, "order is not found");

  const currentOrder = order.status;

  const nextStatus = () => {
    if (order.status == "delivered" || order.status === "canceled")
      throw errorHandler(400, "Unable to change status");
    if (order.status == "pending") return "paid";
    if (order.status == "paid") return "shipping";
    if (order.status == "shipping") return "delivered";

    throw errorHandler(400, "Invalid status transition");
  };

  return await prisma.order.update({
    where: { id: orderId, status: currentOrder },
    data: { status: status ? status : nextStatus() },
  });
};

const deleteAllOrders = async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
};

const getOrders = async ({
  id,
  role,
  search,
}: {
  id: string;
  role: "admin" | "customer";

  search: string;
}) => {
  return await prisma.order.findMany({
    include: {
      items: true,
      payment: true,
    },
    where: {
      ...(role === "customer" && { buyerId: id }),
      ...(search &&
        role === "admin" && {
          OR: [
            { buyerId: { contains: search, mode: "insensitive" } },
            { id: { contains: search, mode: "insensitive" } },
          ],
        }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// new model

const createOrder = async ({
  userId,
  orderData,
}: {
  userId: string | null;
  orderData: PlaceOrderBody;
}) => {
  const order = await prisma.order.create({
    data: {
      buyerId: userId,
      buyerEmail: orderData.buyerEmail,
      contactNumber: orderData.contactNumber,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod,
      billingFirstName: orderData.billingAddress.firstName,
      billingLastName: orderData.billingAddress.lastName,
      billingCompanyName: orderData.billingAddress.companyName,
      billingStreet: orderData.billingAddress.streetAddress,
      billingCity: orderData.billingAddress.city,
      billingPostcode: orderData.billingAddress.postcode,
      billingCountry: orderData.billingAddress.country,
      billingPhone: orderData.billingAddress.phone,
      billingEmail: orderData.billingAddress.email,
      shippingFirstName: orderData.shippingAddress.firstName,
      shippingLastName: orderData.shippingAddress.lastName,
      shippingCompanyName: orderData.shippingAddress.companyName,
      shippingStreet: orderData.shippingAddress.streetAddress,
      shippingCity: orderData.shippingAddress.city,
      shippingPostcode: orderData.shippingAddress.postcode,
      shippingCountry: orderData.shippingAddress.country,
      shippingPhone: orderData.shippingAddress.phone,
      shippingEmail: orderData.shippingAddress.email,
      items: {
        create: orderData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          productTitle: item.productTitle,
        })),
      },
      notes: orderData.notes,
    },
  });

  return order;
};

export default {
  getMyOrders,
  getOrderById,
  placeOrder,
  cancelOrder,
  getOrders,
  updateOrderStatus,
  deleteAllOrders,
  createOrder,
};
