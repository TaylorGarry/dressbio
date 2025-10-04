import { createSlice } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: storedCart },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);
      if (existingItem) existingItem.quantity += 1;
      else state.items.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item && quantity > 0) item.quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
