import express from "express";
import { getAllOrders, getMyOrders, placeOrder, updateOrderStatus } from "../Controllers/order.controller.js";
import {adminMiddleware} from "../Middlewares/admin.middleware.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/orders", authMiddleware, placeOrder);
router.get("/orders/my", authMiddleware, getMyOrders);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
