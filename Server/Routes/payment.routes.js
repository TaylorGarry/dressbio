import express from "express";
import { createPaymentIntent, verifyPayment } from "../Controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-intent", authMiddleware, createPaymentIntent);
router.post("/verify", authMiddleware, verifyPayment);

export default router;
