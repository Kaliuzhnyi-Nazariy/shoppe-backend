import { Router } from "express";
import checkCtrl from "../controllers/checkout";
import express from "express";

const router = Router();

router.post("/checkout/session", checkCtrl.createStripeCheckout);

router.post(
  "/checkout/webhook",
  express.raw({ type: "application/json" }),
  checkCtrl.stripeWebhookController,
);

export default router;
