import { Router } from "express";
import userCtrl from "../controllers/users";
import { isAuthenticated } from "../middlewares";

const router = Router();

router.get("/me", userCtrl.getUser);

router.put("/update", isAuthenticated, userCtrl.updateUser);

router.delete("/delete", isAuthenticated, userCtrl.deleteUser);

export default router;
