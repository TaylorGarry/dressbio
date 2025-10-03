import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../Controllers/product.controller.js";
import { authMiddleware } from "../Middlewares/auth.middleware.js";
import { adminMiddleware } from "../Middlewares/admin.middleware.js";

const router = express.Router();

// ✅ Public: Get all products
router.get("/products", getAllProducts);

// ✅ Public: Get single product
router.get("/products/:id", getProductById);

// ✅ Admin only: Create product
router.post("/products", authMiddleware, adminMiddleware, createProduct);

// ✅ Admin only: Update product
router.put("/products/:id", authMiddleware, adminMiddleware, updateProduct);

// ✅ Admin only: Delete product
router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
