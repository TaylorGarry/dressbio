import express from "express";
import {
  getAllOrders,
  getMyOrders,
  placeOrder,
  updateOrderStatus,
  cancelOrder,
} from "../Controllers/order.controller.js";
import { adminMiddleware } from "../Middlewares/admin.middleware.js";
import { authMiddleware } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/orders", authMiddleware, placeOrder);
router.get("/orders/my", authMiddleware, getMyOrders);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.put("/orders/:id/cancel", authMiddleware, cancelOrder);

export default router;
