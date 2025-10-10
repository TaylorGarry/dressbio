import express from "express";
import {
  getAllOrders,
  getMyOrders,
  placeOrder,
  updateOrderStatus,
  cancelOrder,
} from "../Controllers/order.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../Middlewares/upload.js";
// import { authMiddleware } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/orders", authMiddleware,upload.single("paymentProof"), placeOrder);
router.get("/orders/my", authMiddleware, getMyOrders);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.put("/orders/:id/cancel", authMiddleware, cancelOrder);

export default router;
