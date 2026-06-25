import { Router } from "express";
import { authorize, isAuthenticated } from "../middlewares";
import ctrl from "../controllers/payment";
import checkCtrl from "../controllers/checkout";
import express from "express";

const router = Router();

router.post("/checkout/session", checkCtrl.createStripeCheckout);
// router.post("/checkout/session", ctrl.createCheckoutStripeSession);
// router.post("/checkout/session", isAuthenticated, authorize(["customer"]));

router.post(
  "/checkout/webhook",
  express.raw({ type: "application/json" }),
  checkCtrl.stripeWebhookController,
);

// acct_1SCxXsLFIMZzjOPs - local stripe cli 4 90 days

export default router;
