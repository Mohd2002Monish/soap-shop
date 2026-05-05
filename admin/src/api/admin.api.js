import axiosInstance from "./axiosInstance.js";

export const fetchOrders = (params = {}) => axiosInstance.get("/orders", { params }).then(r => r.data);
export const fetchOrderById = (id) => axiosInstance.get(`/orders/${id}`).then(r => r.data);
export const updateStatus = (id, status, note = "") => axiosInstance.put(`/orders/${id}/status`, { status, note }).then(r => r.data);
export const markPaid = (id) => axiosInstance.put(`/orders/${id}/payment`).then(r => r.data);
export const addNote = (id, adminNote) => axiosInstance.put(`/orders/${id}/note`, { adminNote }).then(r => r.data);

export const fetchProducts = (params = {}) => axiosInstance.get("/products", { params }).then(r => r.data);
export const fetchProductById = (id) => axiosInstance.get(`/products/${id}`).then(r => r.data);
export const createProduct = (data) => axiosInstance.post("/products", data).then(r => r.data);
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data).then(r => r.data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`).then(r => r.data);
export const uploadImage = (formData) => axiosInstance.post("/upload/image", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);

export const fetchCategories = () => axiosInstance.get("/categories").then(r => r.data);
export const createCategory = (data) => axiosInstance.post("/categories", data).then(r => r.data);
export const deleteCategory = (id) => axiosInstance.delete(`/categories/${id}`).then(r => r.data);

export const fetchCustomers = () => axiosInstance.get("/auth/users").then(r => r.data);
