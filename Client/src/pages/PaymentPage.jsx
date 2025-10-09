import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// Load Stripe with your public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Checkout form component
const CheckoutForm = ({ clientSecret, orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required", // stay on the page if required
    });

    setLoading(false);

    if (error) {
      console.error(error);
      navigate("/payment-failed");
    } else if (paymentIntent?.status === "succeeded") {
      navigate("/payment-success", { state: { orderData, paymentIntentId: paymentIntent.id } });
    } else {
      navigate("/payment-failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Complete Payment</h2>
      <PaymentElement />
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

// Main Payment Page
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, orderData } = location.state || {};
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!amount || !orderData) {
      navigate("/checkout");
      return;
    }

    // Create Stripe PaymentIntent
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post(
          "http://localhost:4000/api/v1/payment/create-intent",
          {
            amount,
            orderId: orderData._id, // <-- send only orderId
            currency: "inr",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Payment intent creation error:", err.response?.data || err.message);
        navigate("/payment-failed");
      }
    };

    createPaymentIntent();
  }, [amount, orderData, navigate]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading payment...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} orderData={orderData} />
    </Elements>
  );
};

export default PaymentPage;
