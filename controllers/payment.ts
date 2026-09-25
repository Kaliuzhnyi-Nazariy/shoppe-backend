import { NextFunction, Request, Response } from "express";
import { controllerWrapper } from "../helpers";
import paymentService from "../service/payment";

const createCheckoutStripeSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await paymentService.createCheckoutStripeSession(req.body);
  res.status(201).json({ url: result.url });
};

export default {
  createCheckoutStripeSession: controllerWrapper(createCheckoutStripeSession),
};
