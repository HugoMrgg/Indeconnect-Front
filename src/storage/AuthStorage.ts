/**
 * Gère le stockage du token d'authentification
 */

const TOKEN_KEY = "indeconnect_auth_token";

export const authStorage = {
    /**
     * Récupère le token du localStorage
     */
    getToken: (): string | null => {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error("[AuthStorage] Erreur lecture token", error);
            return null;
        }
    },

    /**
     * Sauvegarde le token dans localStorage
     */
    setToken: (token: string): void => {
        try {
            if (!token) {
                throw new Error("Token invalide");
            }
            localStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error("[AuthStorage] Erreur sauvegarde token", error);
        }
    },

    /**
     * Supprime le token du localStorage
     */
    clearToken: (): void => {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error("[AuthStorage] Erreur suppression token", error);
        }
    },

    /**
     * Vérifie si un token est présent
     */
    hasToken: (): boolean => {
        return authStorage.getToken() !== null;
    },
} as const;
