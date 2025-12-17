import axios, { AxiosError } from "axios";
import qs from "qs";
import { authStorage } from "@/storage/AuthStorage";
import { userStorage } from "@/storage/UserStorage";
import { ApiError, BackendErrorResponse } from "@/api/errors";

const API_BASE_URL = import.meta.env.VITE_API_HOST + "/indeconnect"; //"http://" +
//const API_BASE_URL_LOCAL = "http://localhost:5237/indeconnect";
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
    (error: AxiosError<BackendErrorResponse>) => {
        if (!error.response) {
            return Promise.reject(
                new ApiError(
                    "Impossible de contacter le serveur. Vérifie ta connexion.",
                    0,
                    null
                )
            );
        }

        const { status = 0, data } = error.response;

        if (status === 401) {
            console.warn("[API] 401 - Session expirée ou token invalide");

            authStorage.clearToken();
            userStorage.clear();

            if (onUnauthorizedCallback) {
                onUnauthorizedCallback();
            }
        }

        if (status === 403) {
            console.warn("[API] 403 - Accès refusé (permissions insuffisantes)");
        }

        const backendMessage = data?.error ?? data?.message;

        const message =
            backendMessage ||
            (status >= 500
                ? "Erreur serveur. Réessaie plus tard."
                : "Une erreur est survenue.");

        return Promise.reject(new ApiError(message, status, data));
    }
);

export default axiosInstance;
