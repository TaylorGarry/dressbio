import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/products";

// Fetch products with pagination
export const fetchProducts = createAsyncThunk("products/fetch", async ({ page = 1, limit = 12, search = "", sort = "" }) => {
  const res = await axios.get(`${API}?page=${page}&limit=${limit}&search=${search}&sort=${sort}`);
  return res.data;
});

// Fetch single product
export const fetchProductById = createAsyncThunk("products/fetchOne", async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
});

const productSlice = createSlice({
  name: "products",
  initialState: { list: [], selected: null, loading: false, hasMore: true },
  reducers: {
    resetProducts: (state) => { state.list = []; state.hasMore = true; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.products.length < action.payload.limit) state.hasMore = false;
        state.list = [...state.list, ...action.payload.products];
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })

      .addCase(fetchProductById.pending, (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
      .addCase(fetchProductById.rejected, (state) => { state.loading = false; });
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
