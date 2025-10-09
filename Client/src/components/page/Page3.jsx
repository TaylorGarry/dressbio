import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../../redux/slices/orderSlice.js";
import toast from "react-hot-toast";

const Page3 = () => {
  const dispatch = useDispatch();
  const { list: orders, loading, error } = useSelector((state) => state.orders);
  const [updating, setUpdating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err || "Failed to update status");
    } finally {
      setUpdating(null);
      // Refresh list in background
      setTimeout(() => dispatch(fetchAllOrders()), 500);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      if (window.confirm("Are you sure you want to cancel this order?")) {
        setUpdating(orderId);
        await dispatch(cancelOrder(orderId)).unwrap();
        toast.success("Order cancelled successfully");
      }
    } catch (err) {
      toast.error(err || "Failed to cancel order");
    } finally {
      setUpdating(null);
      setTimeout(() => dispatch(fetchAllOrders()), 500);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.paymentMethod
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.products?.some((p) =>
        p.product?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-600">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-lg">Loading orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">All Orders</h1>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search by product or payment..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md px-3 py-1 text-sm w-60"
          />
          <select
            className="border rounded-md px-3 py-1 text-sm bg-white"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow">
          <p className="text-lg">No matching orders found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Products</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total Price</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-3 px-4 text-sm">{order._id}</td>
                    <td className="py-3 px-4 text-sm">
                      {order.user?.username || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {order.products?.map((p, i) => (
                        <div key={i} className="text-gray-700">
                          {p.product?.name} × {p.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-sm capitalize">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-sm capitalize">
                      <select
                        className={`border rounded-md px-2 py-1 text-sm ${
                          order.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-600"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={updating === order._id}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={
                          updating === order._id ||
                          order.status === "cancelled"
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page3;
