import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  updateProduct,
} from "../Controllers/product.controller.js";
import { adminMiddleware } from "../Middlewares/admin.middleware.js";
import upload from "../Middlewares/upload.js";  
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/products", getAllProducts);

router.get("/products/:id", getProductById);

router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 10),  
  createProduct
);

router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images"),
  updateProduct
);

router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
