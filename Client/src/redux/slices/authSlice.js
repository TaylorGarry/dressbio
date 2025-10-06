import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/index.js";

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/login", formData, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.put("/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile update failed");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    user:
      typeof window !== "undefined" && localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        if (typeof window !== "undefined")
          localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        if (typeof window !== "undefined")
          localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        if (typeof window !== "undefined")
          localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
