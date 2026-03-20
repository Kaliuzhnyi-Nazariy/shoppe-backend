import { Router } from "express";

import authRoutes from "./auth";
import userRoutes from "./user";
import productRoutes from "./product";
import orderRoutes from "./order";
import cartRoutes from "./cart";
import { errorHandler, notFoundRouteHandler } from "../handlers";

const router = Router();

router.use("/api/auth", authRoutes);

router.use("/api/users", userRoutes);

router.use("/api/products", productRoutes);

router.use("/api/orders", orderRoutes);

router.use("/api/cart", cartRoutes);

router.use(notFoundRouteHandler);

router.use(errorHandler);

export default router;
