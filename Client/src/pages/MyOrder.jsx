import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import NavbarPublic from "../components/layout/NavbarPublic";
// import { toast } from "react-toastify";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

//   const handleCancel = (id) => {
//     if (window.confirm("Are you sure you want to cancel this order?")) {
//       dispatch(cancelOrder(id)).then(() => {
//         toast.success("Order cancelled successfully");
//         dispatch(fetchMyOrders());
//       });
//     }
//   };

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
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-5 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order ID:</span> {order._id}
                  </p>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.status}
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
                            item.product?.image ||
                            "https://via.placeholder.com/100x100?text=No+Image"
                          }
                          alt={item.product?.name || "Product"}
                          className="w-20 h-20 rounded-lg object-cover border"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.product?.name || "Unnamed Product"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-700">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t pt-3 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Payment Method:</span>{" "}
                    {order.paymentMethod?.toUpperCase()}
                  </p>
                  <p>
                    <span className="font-medium">Total Price:</span> ₹
                    {order.totalPrice}
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
                </div>

                {order.status === "pending" && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => console.log("Cancel feature coming soon!")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
