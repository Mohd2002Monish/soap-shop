import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: JSON.parse(localStorage.getItem("soap-shop-auth"))?.userInfo || null,
    token: JSON.parse(localStorage.getItem("soap-shop-auth"))?.token || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.token = action.payload.token;
      localStorage.setItem("soap-shop-auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("soap-shop-auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
