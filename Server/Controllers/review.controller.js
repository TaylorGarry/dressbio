import Product from "../Modals/product.modals.js";

export const addReview = async (req, res) => {
  try {
    const { id } = req.params;  
    const { username, rating, comment } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = { username, rating, comment, createdAt: new Date() };
    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({ message: "Review added successfully", product });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { id } = req.params;  
    const product = await Product.findById(id).select("reviews");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product.reviews);
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    review.updatedAt = new Date();

    await product.save();
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.deleteOne();
    await product.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
