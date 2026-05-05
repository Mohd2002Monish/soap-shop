import axiosInstance from "./axiosInstance.js";

export const placeOrder = async (orderData) => {
  const { data } = await axiosInstance.post("/orders", orderData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await axiosInstance.get("/orders/my");
  return data;
};

export const getMyOrderDetails = async (id) => {
  const { data } = await axiosInstance.get(`/orders/my/${id}`);
  return data;
};

export const cancelOrder = async (id) => {
  const { data } = await axiosInstance.delete(`/orders/my/${id}`);
  return data;
};
