// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },
//     products: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//           index: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//           default: 1,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     shippingInfo: {
//       fullName: { type: String, required: true },
//       email: { type: String, required: true },
//       phone: { type: String, required: true },
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: { type: String, required: true },
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["cod", "razorpay", "stripe", "upi"], // added UPI
//       default: "cod",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["pending", "pendingVerification", "paid", "failed"], // new field
//       default: "pending",
//       index: true,
//     },
//     upiTransactionRef: { type: String },   // UPI transaction reference
//     upiPaymentProof: { type: String },     // file URL / screenshot of payment
//     itemsPrice: { type: Number, required: true },
//     shippingPrice: { type: Number, required: true, default: 0 },
//     totalPrice: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
//       default: "pending",
//       index: true,
//     },
//   },
//   { timestamps: true }
// );

// // Indexes for performance
// orderSchema.index({ user: 1, createdAt: -1 });
// orderSchema.index({ status: 1 });
// orderSchema.index({ "products.product": 1 });

// const Order = mongoose.model("Order", orderSchema);
// export default Order;

// models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    shippingInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "stripe", "upi"],
      default: "cod",
    },
    upiPayment: {
      fileUrl: { type: String },           // path to admin QR or user uploaded proof
      fileUrlUser: { type: String },       // user's uploaded payment screenshot
      status: { type: String, default: "pending" }, // pending / verified / rejected
      transactionRef: { type: String, default: "" },
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
