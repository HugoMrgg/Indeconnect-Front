import axios, { AxiosError } from "axios";
import qs from "qs";
import { authStorage } from "@/storage/AuthStorage";
import { userStorage } from "@/storage/UserStorage";
import { ApiError, BackendErrorResponse } from "@/api/errors";

const API_BASE_URL = "https://" + import.meta.env.VITE_API_HOST + "/indeconnect";
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

// ✅ INTERCEPTEUR REQUEST - Ajoute le token
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

// ✅ INTERCEPTEUR RESPONSE - Gère les erreurs (UN SEUL !)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<BackendErrorResponse>) => {
        // ✅ Ignore les requêtes annulées
        if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
            console.log("[API] Requête annulée (normal)");
            return Promise.reject(error);
        }

        // ✅ Pas de réponse du serveur
        if (!error.response) {
            console.error("[API] Pas de réponse du serveur:", error.message);
            return Promise.reject(
                new ApiError(
                    "Impossible de contacter le serveur. Vérifie ta connexion.",
                    0,
                    null
                )
            );
        }

        const { status = 0, data } = error.response;

        // ✅ 401 - Token expiré/invalide
        if (status === 401) {
            console.warn("[API] 401 - Session expirée ou token invalide");
            authStorage.clearToken();
            userStorage.clear();

            if (onUnauthorizedCallback) {
                onUnauthorizedCallback();
            }
        }

        // ✅ 403 - Accès refusé
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