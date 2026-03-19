import { Router } from "express";
import userCtrl from "../controllers/users";
import { isAuthenticated, validateBody } from "../middlewares";
import { updateUser } from "../validation/user.validation";

const router = Router();

router.get("/me", isAuthenticated, userCtrl.getUser);

router.put(
  "/update",
  isAuthenticated,
  validateBody(updateUser),
  userCtrl.updateUser,
);

router.delete("/delete", isAuthenticated, userCtrl.deleteUser);

export default router;
