import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      index: true,
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    deliverAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
});

productSchema.index(
  { name: "text", category: "text", description: "text" },
  { weights: { name: 5, category: 3, description: 1 } }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
