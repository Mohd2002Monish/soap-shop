import axiosInstance from "./axiosInstance.js";

export const getProducts = async (filters = {}) => {
  const { data } = await axiosInstance.get("/products", { params: filters });
  return data;
};

export const getFeaturedProducts = async () => {
  const { data } = await axiosInstance.get("/products/featured");
  return data;
};

export const getProductBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`/products/${slug}`);
  return data;
};
