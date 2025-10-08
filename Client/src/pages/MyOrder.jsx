import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, cancelOrder } from "../redux/slices/orderSlice";
import NavbarPublic from "../components/layout/NavbarPublic";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);
  const [cancelling, setCancelling] = useState({});

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setCancelling((prev) => ({ ...prev, [id]: true }));
        await dispatch(cancelOrder(id)).unwrap();
        toast.success("Order cancelled successfully");
        dispatch(fetchMyOrders());
      } catch (err) {
        toast.error(err || "Failed to cancel order");
      } finally {
        setCancelling((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  if (loading) {
    return (
      <>
        <NavbarPublic />
        <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
          Loading your orders...
        </div>
      </>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <>
        <NavbarPublic />
        <div className="flex flex-col items-center justify-center min-h-screen mt-16">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/empty-box-7359554-6021605.png"
            alt="No Orders"
            className="w-60 h-60 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">
            You haven’t ordered anything yet
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarPublic />

      <div className="min-h-screen bg-gray-100 py-10 mt-16">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            My Orders
          </h2>

          <div className="space-y-8">
            {orders.map((order) => {
              const isCancelled = order.status === "cancelled";
              return (
                <div
                  key={order._id}
                  className={`border rounded-lg p-5 shadow-sm transition-all duration-200 ${
                    isCancelled
                      ? "bg-gray-100 opacity-70 grayscale hover:opacity-80"
                      : "bg-gray-50 hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <p className="text-sm text-gray-600">
                    </p>
                    <span
                      className={`px-3 py-1 text-sm rounded-full capitalize ${
                        order.status === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {isCancelled ? "Cancelled Order" : order.status}
                    </span>
                  </div>

                  <div className="divide-y">
                    {order.products.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 flex-wrap gap-4"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <img
                            src={
                              item.product?.images?.[0] ||
                              "https://via.placeholder.com/100x100?text=No+Image"
                            }
                            alt={item.product?.name || "Product"}
                            className="w-20 h-20 rounded-lg object-cover border bg-gray-200"
                            loading="lazy"
                          />

                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {item.product?.name || "Unnamed Product"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Category: {item.product?.category || "N/A"}
                            </p>
                          </div>
                        </div>

                        <p className="font-semibold text-gray-700 text-right sm:text-left">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-3 text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {order.paymentMethod?.toUpperCase() || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Total Price:</span> ₹
                      {order.totalPrice?.toLocaleString("en-IN")}
                    </p>
                    <p>
                      <span className="font-medium">Delivery Address:</span>{" "}
                      {order.shippingInfo?.address}, {order.shippingInfo?.city} –{" "}
                      {order.shippingInfo?.postalCode}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span>{" "}
                      {order.shippingInfo?.phone}
                    </p>
                    {order.deliverAt && (
                      <p>
                        <span className="font-medium">Expected Delivery:</span>{" "}
                        {new Date(order.deliverAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {order.status === "pending" && (
                    <div className="mt-4 text-right">
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancelling[order._id]}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          cancelling[order._id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {cancelling[order._id]
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
