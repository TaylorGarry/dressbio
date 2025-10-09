import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../Modals/order.modals.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const { amount, currency = "inr", orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: "Amount and orderId are required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),  
      currency,
      payment_method_types: ["card"],  
      metadata: {
        orderId,
        userId: req.user._id,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe payment error:", error);
    res.status(500).json({ message: "Payment creation failed", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ message: "PaymentIntentId and OrderId are required" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await Order.findByIdAndUpdate(orderId, {
        status: "processing",
        paymentMethod: "stripe",
      });
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};
