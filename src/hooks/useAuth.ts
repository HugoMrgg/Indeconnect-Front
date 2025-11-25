import { useState, useEffect } from "react";
import { AuthService } from "@/api/services/auth";
import { useAuthContext } from "@/hooks/useAuthContext";
import toast from "react-hot-toast";
import { UsersService } from "@/api/services/user";
import { userStorage } from "@/context/UserStorage";
import {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
} from "@/api/services/auth/types";

function parseJwt(token: string): any {
    try {
        const base64 = token.split('.')[1];
        const base64Url = base64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64Url)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

function getUserIdFromToken(token: string): number | null {
    if (!token) {
        console.log("[Auth] Aucun token transmis pour parsing");
        return null;
    }
    const payload = parseJwt(token);
    if (!payload) {
        console.log("[Auth] Echec parsing JWT");
        return null;
    }
    const id = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    console.log("[Auth] UserId extrait du token:", id);
    return Number(id);
}

export function useAuth() {
    const { token, setToken } = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<AuthResponse["user"] | null>(() => {
        // Essaie d'hydrater le user depuis localStorage
        try {
            const raw = userStorage.getUser?.();
            return raw ? raw : null;
        } catch {
            return null;
        }
    });

    // Restore user on mount from token
    useEffect(() => {
        console.log("[Auth] useEffect token:", token, "user:", user);
        if (token && !user) {
            const userId = getUserIdFromToken(token);
            if (userId) {
                console.log("[Auth] Tentative fetch user par id:", userId);
                (async () => {
                    try {
                        const u = await UsersService.getById(userId);
                        setUser(u);
                        userStorage.setUser(u);
                        console.log("[Auth] User restauré depuis l'API:", u);
                    } catch (err) {
                        console.error("[Auth] Erreur récupération user par id", userId, err);
                        setUser(null);
                        setToken(null);
                    }
                })();
            } else {
                console.warn("[Auth] userId non trouvé dans le token, impossible de fetch le user.");
            }
        }
    }, [token, user, setToken]);

    // LOGIN
    const login = async (payload: LoginPayload): Promise<AuthResponse> => {
        setLoading(true);
        setError(null);

        console.log("[Auth] Tentative login...", payload);
        try {
            const res: AuthResponse = await AuthService.login(payload);
            console.log("[Auth] Login réussi:", res);

            setToken(res.token);
            setUser(res.user);
            userStorage.setUser(res.user);

            toast.success(`Bienvenue ${res.user.firstName} 👋`, {
                icon: "🚀",
                style: {
                    borderRadius: "10px",
                    background: "#000",
                    color: "#fff",
                },
            });

            return res;
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Login error";
            setError(msg);
            console.error("[Auth] Login échec:", msg, err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // REGISTER
    const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
        setLoading(true);
        setError(null);

        console.log("[Auth] Tentative register...", payload);
        try {
            const res: AuthResponse = await AuthService.register(payload);
            console.log("[Auth] Register réussi:", res);

            setToken(res.token);
            setUser(res.user);
            userStorage.setUser(res.user);

            toast.success(`Compte créé 🎉 Bienvenue ${res.user.firstName} !`);

            return res;
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Register error";
            setError(msg);
            console.error("[Auth] Register échec:", msg, err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        console.log("[Auth] Logout initié");
        setToken(null);
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        toast.success("Déconnecté avec succès 👋");
    };

    useEffect(() => {
        console.log("[Auth] Etat final dans hook — token:", token, "user:", user);
    }, [token, user]);

    return {
        token,
        user,
        loading,
        error,
        login,
        register,
        logout,
    };
}
