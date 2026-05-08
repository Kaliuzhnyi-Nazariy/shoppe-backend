import { Router } from "express";
import { isAuthenticated } from "../middlewares";
import ctrl from "../controllers/download";

const router = Router();

router.get("/", isAuthenticated, ctrl.getDownloads);

// router.post("/downloads", isAuthenticated, ctrl.postDownloads);

// router.delete("/downloads", isAuthenticated, ctrl.deleteDownloads);

// router.delete("/:id", ctrl.deleteDownloadsById);

export default router;
