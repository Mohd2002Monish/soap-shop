import axiosInstance from "./axiosInstance.js";

export const login = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data;
};

export const register = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const getProfile = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};

export const updateProfile = async (userData) => {
  const { data } = await axiosInstance.put("/auth/me", userData);
  return data;
};
