import axios, { AxiosError } from "axios";
import qs from "qs";
import { authStorage } from "@/storage/AuthStorage";
import { userStorage } from "@/storage/UserStorage";

const API_BASE_URL = "http://localhost:5237/indeconnect";
const REQUEST_TIMEOUT = 10000;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: REQUEST_TIMEOUT,
    paramsSerializer: (params) =>
        qs.stringify(params, {
            arrayFormat: "repeat",
            skipNulls: true,
        }),
});

/**
 * Callback pour gérer les erreurs 401 (non-authentifié)
 */
let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: (() => void) | null) => {
    onUnauthorizedCallback = callback;
};

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

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status;

        // 401 = Non-authentifié (token invalide/expiré) → LOGOUT
        if (status === 401) {
            console.warn("[API] 401 - Session expirée ou token invalide");

            // Nettoyer le storage
            authStorage.clearToken();
            userStorage.clear();

            // Appeler le callback pour logout du contexte
            if (onUnauthorizedCallback) {
                onUnauthorizedCallback();
            }
        }

        // 403 = Non-autorisé (authentifié mais pas les droits) → PAS DE LOGOUT
        if (status === 403) {
            console.warn("[API] 403 - Accès refusé (permissions insuffisantes)");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
