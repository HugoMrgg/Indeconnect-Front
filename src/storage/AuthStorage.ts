/**
 * Gère le stockage du token d'authentification
 * Utilise des cookies sécurisés au lieu de localStorage pour une meilleure sécurité
 */
import { logger } from "@/utils/logger";
import { setCookie, getCookie, removeCookie, hasCookie } from "@/utils/cookieStorage";

const TOKEN_KEY = "indeconnect_auth_token";

export const authStorage = {
    /**
     * Récupère le token depuis un cookie sécurisé
     */
    getToken: (): string | null => {
        try {
            return getCookie(TOKEN_KEY) || null;
        } catch (error) {
            logger.error("AuthStorage.getToken", error);
            return null;
        }
    },

    /**
     * Sauvegarde le token dans un cookie sécurisé
     * Le cookie expire après 7 jours et utilise les flags Secure et SameSite
     */
    setToken: (token: string): void => {
        try {
            if (!token) {
                throw new Error("Token invalide");
            }
            setCookie(TOKEN_KEY, token, {
                expires: 7, // 7 jours
                secure: import.meta.env.PROD, // HTTPS uniquement en production
                sameSite: 'strict', // Protection CSRF
            });
        } catch (error) {
            logger.error("AuthStorage.setToken", error);
        }
    },

    /**
     * Supprime le token du cookie
     */
    clearToken: (): void => {
        try {
            removeCookie(TOKEN_KEY);
        } catch (error) {
            logger.error("AuthStorage.clearToken", error);
        }
    },

    /**
     * Vérifie si un token est présent
     */
    hasToken: (): boolean => {
        return hasCookie(TOKEN_KEY);
    },
} as const;
