import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    navigate("/"); 
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-md w-full">
        <CheckCircle className="mx-auto text-green-500" size={64} />
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase! Your payment was processed successfully.
        </p>

        {orderData._id && (
          <p className="text-sm text-gray-500 mt-2">
            Order ID: <span className="font-medium">{orderData._id}</span>
          </p>
        )}

        <div className="mt-6 text-left">
          <h2 className="font-semibold text-gray-700 mb-2">Order Summary:</h2>
          {orderData.products.map((item) => (
            <div key={item._id} className="flex justify-between mb-1">
              <p>{item.product.name} × {item.quantity}</p>
              <p>₹{item.price * item.quantity}</p>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>₹{orderData.totalPrice}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
