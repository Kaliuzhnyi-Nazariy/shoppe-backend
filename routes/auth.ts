import { Router } from "express";
import authCtrl from "../controllers/auth";
import {
  isAuthenticated,
  isPasswordSetMiddleware,
  validateBody,
} from "../middlewares";
import {
  forgetPasswordEmailValidation,
  resetPasswordValidation,
  setPasswordValidation,
  signInValidation,
  userSignupCheckoutValidation,
  userSignupValidation,
} from "../validation/auth.validation";

const router = Router();

router.post("/signup", validateBody(userSignupValidation), authCtrl.signUp);

router.post(
  "/signin",
  validateBody(signInValidation),
  isPasswordSetMiddleware,
  authCtrl.signIn,
);

router.post(
  "/password/forget",
  validateBody(forgetPasswordEmailValidation),
  authCtrl.forgetPassword,
);

router.patch(
  "/password/reset",
  validateBody(resetPasswordValidation),
  authCtrl.resetPassword,
);

router.post(
  "/signup/checkout",
  validateBody(userSignupCheckoutValidation),
  authCtrl.createUserCheckout,
);

router.post(
  "/password/reset/request",
  isAuthenticated,
  authCtrl.resetPasswordRequest,
);

router.post(
  "/set/password/:tokenId",
  validateBody(setPasswordValidation),
  authCtrl.setPassword,
);

export default router;
