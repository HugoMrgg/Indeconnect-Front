import { useState, useEffect } from "react";
import { AuthService } from "@/api/services/auth";
import { useAuthContext } from "@/hooks/useAuthContext";
import toast from "react-hot-toast";
import { UsersService } from "@/api/services/user";
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
    if (!token) return null;
    const payload = parseJwt(token);
    if (!payload) return null;
    const id = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return Number(id);
}

export function useAuth() {
    const { token, setToken, user, setUser, userRole } = useAuthContext(); // ← CHANGÉ
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Restore user on mount from token
    useEffect(() => {
        if (token && !user) {
            const userId = getUserIdFromToken(token);
            if (userId) {
                (async () => {
                    try {
                        const u = await UsersService.getById(userId);
                        setUser(u); // ← Met à jour le Context
                    } catch (err) {
                        console.error("[Auth] Erreur récupération user", err);
                        setUser(null);
                        setToken(null);
                    }
                })();
            }
        }
    }, [token, user, setToken, setUser]);

    // LOGIN
    const login = async (payload: LoginPayload): Promise<AuthResponse> => {
        setLoading(true);
        setError(null);

        try {
            const res: AuthResponse = await AuthService.login(payload);

            setToken(res.token);
            setUser(res.user);

            toast.success(`Bienvenue ${res.user.firstName}`, {
                icon: "",
                style: {
                    borderRadius: "10px",
                    background: "#000",
                    color: "#fff",
                },
            });

            return res;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Login error";
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // REGISTER
    const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
        setLoading(true);
        setError(null);

        try {
            const res: AuthResponse = await AuthService.register(payload);

            setToken(res.token);
            setUser(res.user); // ← Met à jour le Context

            toast.success(`Compte créé Bienvenue ${res.user.firstName} !`);

            return res;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Register error";
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        toast.success("Déconnecté avec succès");
    };

    return {
        token,
        user,
        userRole,
        loading,
        error,
        login,
        register,
        logout,
    };
}
