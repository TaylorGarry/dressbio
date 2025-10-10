// import express from "express";
// import { createPaymentIntent, verifyPayment } from "../Controllers/payment.controller.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// router.post("/create-intent", authMiddleware, createPaymentIntent);
// router.post("/verify", authMiddleware, verifyPayment);

// export default router;


import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  submitUPIPayment,
  getPendingUPIPayments,
  verifyUPIPayment,
} from "../Controllers/payment.controller.js";
import upload from "../Middlewares/upload.js";

const router = express.Router();

// ------------------ USER ------------------
router.post(
  "/upi/submit",
  authMiddleware,
  upload.single("paymentProof"), // image field name from frontend
  submitUPIPayment
);

// ------------------ ADMIN ------------------
router.get("/admin/upi/pending", authMiddleware, adminMiddleware, getPendingUPIPayments);
router.put("/admin/upi/:orderId/verify", authMiddleware, adminMiddleware, verifyUPIPayment);

export default router;
