import { Router } from "express";
import { authorize, isAuthenticated, validateBody } from "../middlewares";
import productsService from "../controllers/products";
import { addAndUpdateProductValidation } from "../validation/product.validation";

const router = Router();

router.get("/", productsService.getProducts);

router.get("/:productId", productsService.getProductById);

router.post(
  "/",
  isAuthenticated,
  authorize(["admin"]),
  validateBody(addAndUpdateProductValidation),
  productsService.addProduct,
);

router.put(
  "/:productId",
  isAuthenticated,
  authorize(["admin"]),
  validateBody(addAndUpdateProductValidation),
  productsService.updateProduct,
);

router.patch(
  "/archive/:productId",
  isAuthenticated,
  authorize(["admin"]),
  productsService.archiveProduct,
);

router.patch(
  "/amount/:productId",
  isAuthenticated,
  authorize(["admin"]),
  productsService.updateProductAmount,
);

router.delete(
  "/:productId",
  isAuthenticated,
  authorize(["admin"]),
  productsService.deleteProduct,
);

export default router;
