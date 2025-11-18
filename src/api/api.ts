import axios from "axios";
import { authStorage } from "@/context/AuthStorage";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5237/indeconnect/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
    (config) => {
        const token = authStorage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authStorage.clear(); // logout automatique
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;