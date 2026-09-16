import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response.data; // 🔥 THIS LINE FIXES EVERYTHING
  },
  (error) => {
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
