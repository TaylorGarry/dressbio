import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1/products";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async ({ page = 1, limit = 12, search = "", sort = "" }) => {
    const res = await axios.get(
      `${API}?page=${page}&limit=${limit}&search=${search}&sort=${sort}`
    );
    console.log("Res of product::::", res.data);
    return res.data; // contains { products, page, totalPages, ... }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchOne",
  async (id) => {
    const res = await axios.get(`${API}/${id}`);
    return res.data;
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (productData, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.post(API, productData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updatedData }, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.put(`${API}/${id}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { getState }) => {
    const token = getState().auth.token;
    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    page: 1,
    totalPages: 1,
    hasMore: true,
    error: null,
  },
  reducers: {
    resetProducts: (state) => {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        const { products = [], page = 1, totalPages = 1 } = action.payload;

        if (page === 1) {
          // First page -> reset
          state.list = products;
        } else {
          // Subsequent pages -> append unique
          const newProducts = products.filter(
            (p) => !state.list.some((existing) => existing._id === p._id)
          );
          state.list = [...state.list, ...newProducts];
        }

        state.page = page;
        state.totalPages = totalPages;
        state.hasMore = page < totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // FETCH ONE PRODUCT
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })

      // ADD PRODUCT
      .addCase(addProduct.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // UPDATE PRODUCT
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
