import { NextFunction, Request, Response } from "express";
import { controllerWrapper, isGuestMode } from "../helpers";
import orderService from "../service/orders";
import paymentService from "../service/payment";

const createStripeCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = await isGuestMode(req);
  const order = await orderService.createOrder({
    userId: data.id,
    orderData: req.body,
  });

  const payment = await paymentService.createPayment({
    orderId: order.id,
    amount: order.totalPrice,
    method: order.paymentMethod,
  });

  try {
    const stripe = await paymentService.createCheckoutStripeSession(
      order.id,
      payment.id,
      req.body.items,
    );

    await paymentService.updatePaymentProvider({
      paymentId: payment.id,
      provider: stripe.id,
    });
    res.status(201).json({ url: stripe.url });
  } catch (error) {
    await orderService.updateOrderStatus(order.id, "canceled");

    throw error;
  }
};

const stripeWebhookController = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature || signature === undefined) {
    return res.status(500).json({ message: "no signature" });
  }

  const sign = Array.isArray(signature) ? signature[0] : signature;
  // const signature = req.headers["stripe-signature"];
  await paymentService.handleStripeWebhook(req.body, sign);

  res.sendStatus(200);
};

export default {
  createStripeCheckout: controllerWrapper(createStripeCheckout),
  stripeWebhookController: controllerWrapper(stripeWebhookController),
};
