import express from "express";
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../Controllers/review.controller.js";

const router = express.Router();

router.get("/products/:id/reviews", getReviews);

router.post("/products/:id/reviews", addReview);

router.put("/products/:productId/reviews/:reviewId", updateReview);

router.delete("/products/:productId/reviews/:reviewId", deleteReview);

export default router;
