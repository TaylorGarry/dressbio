import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const placeOrder = createAsyncThunk("orders/placeOrder", async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/orders", orderData, { headers: { "Content-Type": "application/json" } });
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to place order");
  }
});

export const fetchMyOrders = createAsyncThunk("orders/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/orders/my");
    return data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
  }
});

export const fetchAllOrders = createAsyncThunk("orders/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/orders");
    return data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch all orders");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { list: [], loading: false, error: null },
  reducers: { clearOrders: (state) => { state.list = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; state.list.push(action.payload); })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
