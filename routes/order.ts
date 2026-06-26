import { Router } from "express";
import { authorize, isAuthenticated, validateBody } from "../middlewares";
import ctrl from "../controllers/orders";
import { orderValidation } from "../validation/order.validation";

const router = Router();

router.get("/my", isAuthenticated, ctrl.getMyOrders);

router.get(
  "/",
  isAuthenticated,
  authorize(["admin", "customer"]),
  ctrl.getOrders,
);

router.get("/:orderId", ctrl.getOrderById);

router.post("/place", validateBody(orderValidation), ctrl.placeOrder);

router.patch("/cancel/:orderId", isAuthenticated, ctrl.cancelOrder);

router.patch(
  "/status/:orderId",
  isAuthenticated,
  authorize(["admin"]),
  ctrl.updateOrderStatus,
);

router.delete("/", ctrl.deleteAllOrders);

router.get("/download/:orderId", isAuthenticated, ctrl.downloadOrder);

export default router;
