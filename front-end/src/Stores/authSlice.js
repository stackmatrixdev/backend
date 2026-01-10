// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isAdmin: false, // Keep this for backward compatibility
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      // Set isAdmin based on user role for backward compatibility
      state.isAdmin = action.payload.user?.role === "admin";
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAdmin = false;
      // Clear localStorage
      localStorage.removeItem("auth");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Update isAdmin if role changes
      if (action.payload.role) {
        state.isAdmin = action.payload.role === "admin";
      }
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
