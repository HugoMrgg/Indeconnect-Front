import axios from "axios";
import { authStorage } from "@/context/AuthStorage";
import {userStorage} from "@/context/UserStorage";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5237/indeconnect",

    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
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
            authStorage.clearToken(); // logout automatique
            userStorage.clear();
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;