import Product from "../Modals/product.modals.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, available, deliverAt } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one product image is required" });
    }

    const imageUploadPromises = req.files.map((file) =>
      uploadOnCloudinary(file.path, "products")
    );

    const imageUrls = await Promise.all(imageUploadPromises);

    const validImageUrls = imageUrls.filter((url) => !!url);
    if (validImageUrls.length === 0) {
      return res.status(500).json({ message: "Failed to upload images to Cloudinary" });
    }

    const product = new Product({
      name,
      description,
      category,
      images: validImageUrls,  
      price,
      available,
      deliverAt,
      createdBy: req.user?.id,
    });
    await product.save();
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(" Create Product Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.available) filters.available = req.query.available === "true";
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    }

    const sort = req.query.sort || "-createdAt";

    const products = await Product.find(filters)
      .populate("createdBy", "username accountType")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      page,
      limit,
      totalProducts,
      totalPages,
      hasNextPage: page < totalPages,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "username accountType")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    const updateData = { ...req.body };
    Object.keys(updateData).forEach((key) => {
      if (
        updateData[key] === undefined ||
        updateData[key] === "undefined" ||
        updateData[key] === "" ||
        updateData[key] === null
      ) {
        delete updateData[key];
      }
    });

    if (updateData.deliverAt) {
      const parsedDate = new Date(updateData.deliverAt);
      if (!isNaN(parsedDate)) {
        updateData.deliverAt = parsedDate;
      } else {
        delete updateData.deliverAt;
      }
    }
    let finalImages = existingProduct.images || [];
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        const cloudUrl = await uploadOnCloudinary(file.path, "products");
        if (cloudUrl) uploadedImages.push(cloudUrl);
      }
      finalImages = [...finalImages, ...uploadedImages];
    }
    if (updateData.images) {
      if (typeof updateData.images === "string") {
        updateData.images = [updateData.images];
      }
      finalImages = updateData.images;
    }
    if (!finalImages || finalImages.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }
    updateData.images = finalImages;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const query = req.query.query?.trim();
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };
    const products = await Product.find(searchFilter, {
      name: 1,
      price: 1,
      description: 1,
      images: 1,
      category: 1,
    })
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalProducts = await Product.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      query,
      page,
      limit,
      totalProducts,
      totalPages,
      hasNextPage: page < totalPages,
      products,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

