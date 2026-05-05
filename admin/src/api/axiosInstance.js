import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const state = JSON.parse(localStorage.getItem("soap-shop-admin-auth"));
  if (state && state.token) {
    config.headers.Authorization = `Bearer ${state.token}`;
  }
  return config;
});

export default axiosInstance;
