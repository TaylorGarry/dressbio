import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (id, type, currentQty) => {
    const newQty = type === "inc" ? currentQty + 1 : currentQty - 1;
    if (newQty > 0) dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty!</h2>
        <p className="text-gray-600 mb-6">Looks like you haven’t added anything yet.</p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Shopping Cart</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow"
            >
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-24 h-24 object-cover rounded cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              />
              <div className="flex-1 sm:ml-4 text-center sm:text-left mt-3 sm:mt-0">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>

              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() => handleQuantityChange(item._id, "dec", item.quantity)}
                  className="px-2 py-1 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, "inc", item.quantity)}
                  className="px-2 py-1 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:ml-6 mt-3 sm:mt-0">
                <span className="font-medium text-gray-700">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="ml-4 text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>₹00</span>
          </div>
          <div className="border-t my-3"></div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => navigate("/checkout")}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            >
              Checkout
            </button>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => dispatch(clearCart())}
              className="px-6 py-2 border border-red-400 text-red-500 rounded hover:bg-red-50 cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
