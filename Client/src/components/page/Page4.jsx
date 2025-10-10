import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/orderSlice";

const Page4 = () => {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);
  const [upiOrders, setUpiOrders] = useState([]);
  const [modalData, setModalData] = useState(null); // For popup modal

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.paymentMethod === "upi" &&
        order.upiPayment &&
        order.upiPayment.status === "pending"
    );
    setUpiOrders(filtered);
  }, [orders]);

  const handleVerify = async (orderId, approved) => {
    const newStatus = approved ? "processing" : "cancelled";
    await dispatch(updateOrderStatus({ orderId, status: newStatus }));
    alert(`UPI payment ${approved ? "approved" : "rejected"}!`);
  };

  if (loading) return <p>Loading orders...</p>;
  if (upiOrders.length === 0)
    return (
      <p className="p-6 text-center text-gray-600">
        No UPI payments pending verification.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">UPI Payment Verification</h2>
      <div className="space-y-4">
        {upiOrders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center"
          >
            <div className="mb-3 md:mb-0 space-y-2">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>User:</strong> {order.shippingInfo.fullName} ({order.shippingInfo.email})</p>
              <p><strong>Amount:</strong> ₹{order.totalPrice}</p>
              <p>
                <strong>Transaction ID:</strong>{" "}
                <span
                  onClick={() => setModalData(order.upiPayment?.transactionRef)}
                  className="text-blue-600 underline cursor-pointer"
                  title="Click to view"
                >
                  {order.upiPayment?.transactionRef || "Not Provided"}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Admin should verify the payment using this transaction ID.
              </p>
            </div>
            <div className="space-x-2 mt-2 md:mt-0">
              <button
                onClick={() => handleVerify(order._id, true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleVerify(order._id, false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>
            <p className="break-all"><strong>Transaction ID:</strong> {modalData}</p>
            <p className="mt-2 text-gray-600 text-sm">
              Use this transaction ID to verify the payment with the user.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page4;
