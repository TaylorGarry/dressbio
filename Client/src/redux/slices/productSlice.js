import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1/products";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async ({ page = 1, limit = 12, search = "", sort = "" }) => {
    const res = await axios.get(
      `${API}?page=${page}&limit=${limit}&search=${search}&sort=${sort}`
    );
    return res.data;
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
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === "images" && Array.isArray(productData.images)) {
        productData.images.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, productData[key]);
      }
    });
    const res = await axios.post(API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.product;
  }
);
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();

      for (const key in updatedData) {
        const value = updatedData[key];
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "undefined"
        ) {
          if (key === "images" && Array.isArray(value)) {
            value.forEach((file) => {
              formData.append("images", file);
            });
          } else {
            formData.append(key, value);
          }
        }
      }

      const res = await axios.put(`${API}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { products = [], page = 1, totalPages = 1 } = action.payload;
        if (page === 1) {
          state.list = products;
        } else {
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
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
