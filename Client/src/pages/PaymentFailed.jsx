import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  const handleRetry = () => {
    if (orderData) {
      navigate("/payment", { state: { amount: orderData.totalPrice, orderData } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-md w-full">
        <XCircle className="mx-auto text-red-500" size={64} />
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">
          Payment Failed ❌
        </h1>
        <p className="text-gray-600 mt-2">
          Oops! Something went wrong while processing your payment.
        </p>

        {orderData?._id && (
          <p className="text-sm text-gray-500 mt-2">
            Order ID: <span className="font-medium">{orderData._id}</span>
          </p>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={handleRetry}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry Payment
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
