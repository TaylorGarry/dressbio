import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // 🟢 Added useLocation
import { placeOrder } from "../redux/slices/orderSlice";

const Checkout = () => {
  const location = useLocation(); // 🟢
  const { items: cartItems } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState([]); // 🟢 new state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  // 🟢 Detect if product came via Buy Now or from Cart
  useEffect(() => {
    if (location.state?.product) {
      setCheckoutItems([{ ...location.state.product, quantity: 1 }]);
    } else {
      setCheckoutItems(cartItems);
    }
  }, [location.state, cartItems]);

  // 🟢 Calculate prices dynamically
  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.address) {
      alert("Please fill all required fields");
      return;
    }

    // 🟢 Use checkoutItems instead of cartItems
    const orderData = {
      shippingInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      orderItems: checkoutItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
      })),
      paymentMethod: formData.paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: shipping,
      totalPrice: total,
    };

    const result = await dispatch(placeOrder(orderData));

    if (result.meta.requestStatus === "fulfilled") {
      alert("Order placed successfully!");
      navigate("/my-orders");
    } else {
      alert("Failed to place order. Try again!");
    }
  };

  // 🟢 Handle empty state correctly
  if (checkoutItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359555-6021606.png"
          alt="Empty Cart"
          className="w-60 h-60 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 mt-16">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Your Shopping List
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* Shipping Form */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="border rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="razorpay" disabled>
                  Razorpay (Coming Soon)
                </option>
                <option value="stripe" disabled>
                  Stripe (Coming Soon)
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4 cursor-pointer disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* 🟢 Right side summary */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            {checkoutItems.map((item) => (
              <div key={item._id} className="flex justify-between mb-3">
                <p className="text-gray-700">
                  {item.name} × {item.quantity || 1}
                </p>
                <p className="font-semibold">₹{item.price * (item.quantity || 1)}</p>
              </div>
            ))}
            <hr className="my-3" />
            <div className="flex justify-between text-gray-700">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <div className="flex justify-between text-gray-700">
              <p>Shipping</p>
              <p>{shipping === 0 ? "Free" : `₹${shipping}`}</p>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-3">
              <p>Total</p>
              <p>₹{total}</p>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="w-full py-2 mt-6 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
