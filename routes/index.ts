import { Router } from "express";

import authRoutes from "./auth";
import userRoutes from "./user";
import productRoutes from "./product";
import orderRoutes from "./order";
import cartRoutes from "./cart";
import addressRoutes from "./address";
import downloadRoutes from "./download";
import reviewsRoutes from "./reviews";
import { errorHandlerMiddleware, notFoundRouteHandler } from "../handlers";

const router = Router();

router.use("/api/auth", authRoutes);

router.use("/api/users", userRoutes);

router.use("/api/products", productRoutes);

router.use("/api/orders", orderRoutes);

router.use("/api/cart", cartRoutes);

router.use("/api/address", addressRoutes);

router.use("/api/downloads", downloadRoutes);

router.use("/api/reviews", reviewsRoutes);

router.use(notFoundRouteHandler);

router.use(errorHandlerMiddleware);

export default router;
