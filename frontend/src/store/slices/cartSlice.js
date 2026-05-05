import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("soap-shop-cart"))?.items || [],
    coupon: JSON.parse(localStorage.getItem("soap-shop-cart"))?.coupon || null,
  },
  reducers: {
    addItem(state, { payload }) {
      const existing = state.items.find((i) => i._id === payload._id);
      if (existing) {
        existing.quantity += payload.quantity ?? 1;
      } else {
        state.items.push({ ...payload, quantity: payload.quantity ?? 1 });
      }
      localStorage.setItem("soap-shop-cart", JSON.stringify(state));
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter((i) => i._id !== payload);
      localStorage.setItem("soap-shop-cart", JSON.stringify(state));
    },
    updateQty(state, { payload: { id, quantity } }) {
      const item = state.items.find((i) => i._id === id);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem("soap-shop-cart", JSON.stringify(state));
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      localStorage.setItem("soap-shop-cart", JSON.stringify(state));
    },
    applyCoupon(state, { payload }) {
      state.coupon = payload;
      localStorage.setItem("soap-shop-cart", JSON.stringify(state));
    },
    removeCoupon(state) {
      state.coupon = null;
      localStorage.setItem("soap-shop-cart", JSON.stringify(state));
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQty,
  clearCart,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;
export default cartSlice.reducer;
