import axiosInstance from "./axiosInstance.js";

export const loginAdmin = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  if (data.role !== "admin") throw new Error("Access denied. Admin only.");
  return data;
};
