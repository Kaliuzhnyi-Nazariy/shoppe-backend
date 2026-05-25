import { Router } from "express";
import ctrl from "../controllers/review";
import { isAuthenticated, validateBody } from "../middlewares";
import {
  addReviewValidation,
  updateReviewValidation,
} from "../validation/reviews.validation";

const router = Router();

router.get("/:productId", ctrl.getReviews);

router.post(
  "/post/:productId",
  isAuthenticated,
  validateBody(addReviewValidation),
  ctrl.addReview,
);

router.put(
  "/update/:productId",
  isAuthenticated,
  validateBody(updateReviewValidation),
  ctrl.updateReview,
);

router.delete("/delete/:productId", isAuthenticated, ctrl.deleteReview);

export default router;
