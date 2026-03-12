import { Router } from "express";
import authCtrl from "../controllers/auth";
import { isAuthenticated, validateBody } from "../middlewares";
import {
  forgetPasswordEmailValidation,
  resetPasswordValidation,
  signInValidation,
  userSignupValidation,
} from "../validation/user.validation";

const router = Router();

router.post("/signup", validateBody(userSignupValidation), authCtrl.signUp);

router.post("/signin", validateBody(signInValidation), authCtrl.signIn);

router.post("/signout", isAuthenticated, authCtrl.signOut);

router.post(
  "/password/forget",
  validateBody(forgetPasswordEmailValidation),
  authCtrl.forgetPassword,
);

router.patch(
  "/password/reset/:tokenId",
  validateBody(resetPasswordValidation),
  authCtrl.resetPassword,
);

export default router;
