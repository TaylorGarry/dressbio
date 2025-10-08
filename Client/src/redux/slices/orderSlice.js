import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API, { withToken } from "../../api";

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.user?.token ||
        getState().auth?.token ||
        localStorage.getItem("token");

      const api = withToken(token);
      const { data } = await api.post("/orders", orderData);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to place order");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.user?.token ||
        getState().auth?.token ||
        localStorage.getItem("token");

      const api = withToken(token);
      const { data } = await api.get("/orders/my");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status, paymentMethod, sort = "desc" } = params;
      const token =
        getState().auth?.user?.token ||
        getState().auth?.token ||
        localStorage.getItem("token");

      const api = withToken(token);

      const query = new URLSearchParams({
        page,
        limit,
        sort,
        ...(status ? { status } : {}),
        ...(paymentMethod ? { paymentMethod } : {}),
      });

      const { data } = await api.get(`/orders?${query.toString()}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch all orders");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.user?.token ||
        getState().auth?.token ||
        localStorage.getItem("token");

      const api = withToken(token);
      const { data } = await api.put(`/orders/${orderId}/cancel`);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel order");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.user?.token ||
        getState().auth?.token ||
        localStorage.getItem("token");

      const api = withToken(token);
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update order status");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
    filters: { status: "", paymentMethod: "", sort: "desc" },
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.list = [];
      state.total = 0;
      state.page = 1;
      state.totalPages = 1;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.orders;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.list = state.list.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.list = state.list.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      });
  },
});

export const { clearOrders, setFilters } = orderSlice.actions;
export default orderSlice.reducer;
