import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    adminInfo: JSON.parse(localStorage.getItem("soap-shop-admin-auth")) || null,
    token: JSON.parse(localStorage.getItem("soap-shop-admin-auth"))?.token || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.adminInfo = action.payload;
      state.token = action.payload.token;
      localStorage.setItem("soap-shop-admin-auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.adminInfo = null;
      state.token = null;
      localStorage.removeItem("soap-shop-admin-auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
