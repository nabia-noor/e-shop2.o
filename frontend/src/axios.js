import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // ✅ Backend ka base URL
  withCredentials: true, // for cookies (if needed)
});

// Add token to Authorization header from localStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
