import { Router } from "express";
import { authorize, isAuthenticated, validateBody } from "../middlewares";
import productsCtrl from "../controllers/products";
import {
  addAndUpdateProductValidation,
  updateAmpuntOfProduct,
  UpdateProductValidation,
} from "../validation/product.validation";
import multer from "multer";

const router = Router();

// const upload = multer();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", productsCtrl.getProducts);

router.get("/stats", productsCtrl.getProductStats);

router.get("/:productId", productsCtrl.getProductById);

router.get("/category/:category", productsCtrl.getProductByCategory);

router.post(
  "/",
  isAuthenticated,
  authorize(["admin"]),
  upload.array("product_photo", 10),
  validateBody(addAndUpdateProductValidation),
  productsCtrl.addProduct,
);

router.put(
  "/:productId",
  isAuthenticated,
  authorize(["admin"]),
  upload.array("product_photo", 10),
  validateBody(UpdateProductValidation),
  productsCtrl.updateProduct,
);

router.patch(
  "/archive/:productId",
  isAuthenticated,
  authorize(["admin"]),
  productsCtrl.archiveProduct,
);

router.patch(
  "/amount/:productId",
  isAuthenticated,
  authorize(["admin"]),
  validateBody(updateAmpuntOfProduct),
  productsCtrl.updateProductAmount,
);

router.delete(
  "/:productId",
  isAuthenticated,
  authorize(["admin"]),
  productsCtrl.deleteProduct,
);

export default router;
