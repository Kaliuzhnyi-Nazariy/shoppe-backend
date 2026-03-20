import { Router } from "express";
import ctrl from "../controllers/cart";
import { isAuthenticated, validateBody } from "../middlewares";
import {
  cartAddValidation,
  cartRemoveValidation,
} from "../validation/cart.validation";
const router = Router();

router.get("/", isAuthenticated, ctrl.getCart);

router.post(
  "/add",
  isAuthenticated,
  validateBody(cartAddValidation),
  ctrl.addToCart,
);

router.post(
  "/remove/:itemId",
  isAuthenticated,
  validateBody(cartRemoveValidation),
  ctrl.reduceQuantity,
);

router.delete("/item/:itemId", isAuthenticated, ctrl.removeItemFromCart);

router.delete("/clear", isAuthenticated, ctrl.cleanCart);

router.delete("/", isAuthenticated, ctrl.deleteCart);

export default router;
