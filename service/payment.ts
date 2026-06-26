import { errorHandler } from "../helpers";
import { OrderPlaceProductsItem } from "../interfaces/order";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { PaymentMethods } from "../generated/prisma";
import { PaymentStatus } from "@prisma/client";

const { STRIPE_SECRET_KEY, FRONTEND_URL, ENVIRONMENT } = process.env;

if (!STRIPE_SECRET_KEY) {
  throw errorHandler(500, "No stripe key");
}

const stripeClient = new Stripe(STRIPE_SECRET_KEY);

const createCheckoutStripeSession = async (
  orderId: string,
  paymentId: string,
  products: OrderPlaceProductsItem[],
) => {
  const lineItems = products.map((p) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: p.productTitle,
      },
      unit_amount: Math.round(p.price * 100),
    },
    quantity: p.quantity,
  }));

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card", "blik"],
    line_items: lineItems,
    mode: "payment",
    success_url:
      ENVIRONMENT === "production"
        ? FRONTEND_URL + "/order/success" + orderId
        : "http://localhost:5173/order/success/" + orderId,
    cancel_url:
      ENVIRONMENT === "production"
        ? FRONTEND_URL + "/order/failed"
        : "http://localhost:5173/order/failed",
    metadata: {
      orderId,
      paymentId,
    },
  });

  return { url: session.url, id: session.id };
};

const createPayment = async ({
  orderId,
  amount,
  method,
}: {
  orderId: string;
  amount: number;
  method: PaymentMethods;
}) => {
  return await prisma.payment.create({
    data: {
      orderId,
      method,
      amount,
      status: "pending",
    },
  });
};

const updatePaymentStatus = async ({
  paymentId,
  status,
}: {
  paymentId: string;
  status: PaymentStatus;
}) => {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: status,
    },
  });
};

const updatePaymentProvider = async ({
  paymentId,
  provider,
}: {
  paymentId: string;
  provider: string;
}) => {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: {
      providerId: provider,
    },
  });
};

const handleStripeWebhook = async (data: Buffer, signature: string) => {
  try {
    const event = stripeClient.webhooks.constructEvent(
      data,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    switch (event.type) {
      case "checkout.session.completed":
        const paymentId = event.data.object.metadata?.paymentId;
        const orderId = event.data.object.metadata?.orderId;

        if (!paymentId || !orderId) {
          throw errorHandler(500, "Missing metadata");
        }

        const payment = await prisma.payment.findUnique({
          where: { id: paymentId },
        });

        if (!payment) {
          throw errorHandler(404, "Payment not found");
        }

        if (payment.status === "completed") {
          return;
        }

        await prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { items: true },
          });

          if (!order?.items) {
            throw errorHandler(500);
          }

          for (const item of order.items) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
            });

            if (!product) {
              throw errorHandler(404, "Product not found");
            }

            await tx.product.update({
              where: { id: item.productId, amount: { gte: item.quantity } },
              data: { amount: { decrement: item.quantity } },
            });
          }

          await tx.payment.update({
            where: { id: paymentId },

            data: {
              status: "completed",
            },
          });

          await tx.order.update({
            where: { id: orderId },
            data: {
              status: "paid",
            },
          });
        });

        break;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createCheckoutStripeSession,
  createPayment,
  updatePaymentStatus,
  updatePaymentProvider,
  handleStripeWebhook,
};
