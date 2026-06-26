import { Router } from "express";
import { isAuthenticated } from "../middlewares";
import ctrl from "../controllers/download";

const router = Router();

router.get("/", isAuthenticated, ctrl.getDownloads);

export default router;
