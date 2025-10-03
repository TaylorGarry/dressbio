import express from "express";
import { authMiddleware } from "../Middlewares/auth.middleware.js";
import { getAllOrders, getMyOrders, placeOrder, updateOrderStatus } from "../Controllers/order.controller.js";
import { isAdmin } from "../Middlewares/admin.middleware.js";

const router = express.Router();

router.post("/orders", authMiddleware, placeOrder);
router.get("/orders/my", authMiddleware, getMyOrders);
router.get("/orders", authMiddleware, isAdmin, getAllOrders);
router.put("/orders/:id/status", authMiddleware, isAdmin, updateOrderStatus);

export default router;
