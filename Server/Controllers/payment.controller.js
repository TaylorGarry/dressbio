// import Stripe from "stripe";
// import dotenv from "dotenv";
// import Order from "../Modals/order.modals.js";

// dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createPaymentIntent = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     const { amount, currency = "inr", orderId } = req.body;

//     if (!amount || !orderId) {
//       return res.status(400).json({ message: "Amount and orderId are required" });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100),  
//       currency,
//       payment_method_types: ["card"],  
//       metadata: {
//         orderId,
//         userId: req.user._id,
//       },
//     });

//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id,
//     });
//   } catch (error) {
//     console.error("Stripe payment error:", error);
//     res.status(500).json({ message: "Payment creation failed", error: error.message });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     const { paymentIntentId, orderId } = req.body;

//     if (!paymentIntentId || !orderId) {
//       return res.status(400).json({ message: "PaymentIntentId and OrderId are required" });
//     }

//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === "succeeded") {
//       await Order.findByIdAndUpdate(orderId, {
//         status: "processing",
//         paymentMethod: "stripe",
//       });
//       return res.status(200).json({ message: "Payment verified successfully" });
//     } else {
//       return res.status(400).json({ message: "Payment not successful" });
//     }
//   } catch (error) {
//     console.error("Payment verification error:", error.message);
//     res.status(500).json({ message: "Payment verification failed", error: error.message });
//   }
// };
import Order from "../Modals/order.modals.js"; // your updated order model
import fs from "fs";
import path from "path";

// ------------------ USER: Submit UPI Payment Proof ------------------
export const submitUPIPayment = async (req, res) => {
  const { orderId, transactionRef } = req.body;
  if (!req.file) return res.status(400).json({ message: "Payment proof image is required" });

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  order.upiPayment.fileUrlUser = `/temp/${req.file.filename}`; // store user uploaded proof
  order.upiPayment.transactionRef = transactionRef || "";
  order.upiPayment.status = "pendingVerification"; // waiting for admin approval
  await order.save();

  res.status(200).json({ message: "Payment proof submitted", order });
};

// ------------------ ADMIN: Fetch Pending UPI Payments ------------------
export const getPendingUPIPayments = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ paymentMethod: "upi", paymentStatus: "pendingVerification" })
      .populate("user", "fullName email")
      .populate("products.product", "name");

    res.status(200).json({ orders: pendingOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending payments", error: error.message });
  }
};

// ------------------ ADMIN: Verify/Reject Payment ------------------
export const verifyUPIPayment = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // approve / reject

  const order = await Order.findById(id);
  if (!order || order.paymentMethod !== "upi")
    return res.status(400).json({ message: "No UPI payment to verify" });

  if (action === "approve") {
    order.upiPayment.status = "verified";
    order.status = "processing"; // move order to processing
  } else if (action === "reject") {
    order.upiPayment.status = "rejected";
    order.status = "cancelled";
  } else return res.status(400).json({ message: "Invalid action" });

  await order.save();
  res.status(200).json({ message: `UPI payment ${action}d`, order });
};

