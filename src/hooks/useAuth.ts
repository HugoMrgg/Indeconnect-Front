import { useState, useCallback, useEffect } from "react";
import { AuthService } from "@/api/services/auth";
import { UsersService } from "@/api/services/user";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/api/services/auth/types";

/**
 * Extrait l'ID utilisateur du JWT
 */
function getUserIdFromToken(token: string): number | null {
    try {
        const base64 = token.split(".")[1];
        if (!base64) return null;

        const jsonPayload = decodeURIComponent(
            atob(base64.replace(/-/g, "+").replace(/_/g, "/"))
                .split("")
                .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
                .join("")
        );

        const payload = JSON.parse(jsonPayload);
        const id =
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        return Number(id) || null;
    } catch (error) {
        console.error("[useAuth] Erreur parsing JWT", error);
        return null;
    }
}

/**
 * Hook principal pour la gestion de l'authentification
 */
export function useAuth() {
    const { token, user, userRole, isLoading, login: loginContext, logout: logoutContext, setUser, setLoading } =
        useAuthContext();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token && !user && !isLoading) {
            const userId = getUserIdFromToken(token);

            if (userId) {
                (async () => {
                    try {
                        setLoading(true);
                        const fetchedUser = await UsersService.getById(userId);
                        setUser(fetchedUser);
                    } catch (err) {
                        console.error("[useAuth] Erreur restauration utilisateur", err);
                        logoutContext();
                        navigate("/");
                    } finally {
                        setLoading(false);
                    }
                })();
            }
        }
    }, [token, user, isLoading, setUser, setLoading, logoutContext, navigate]);

    const login = useCallback(
        async (payload: LoginPayload): Promise<AuthResponse> => {
            setError(null);
            setLoading(true);

            try {
                const res = await AuthService.login(payload);

                loginContext(res.user, res.token);

                toast.success(`Bienvenue ${res.user.firstName}`, {
                    icon: "👋",
                    style: {
                        borderRadius: "10px",
                        background: "#000",
                        color: "#fff",
                    },
                });

                return res;
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Erreur de connexion";
                setError(msg);
                toast.error(msg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [loginContext, setLoading]
    );

    const register = useCallback(
        async (payload: RegisterPayload): Promise<AuthResponse> => {
            setError(null);
            setLoading(true);

            try {
                const res = await AuthService.register(payload);

                loginContext(res.user, res.token);

                toast.success(`Compte créé, bienvenue ${res.user.firstName}!`);

                return res;
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Erreur lors de l'inscription";
                setError(msg);
                toast.error(msg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [loginContext, setLoading]
    );

    const logout = useCallback(() => {
        logoutContext();
        toast.success("Déconnexion réussie");
        navigate("/");
    }, [logoutContext, navigate]);

    return {
        token,
        user,
        userRole,
        isLoading,
        isAuthenticated: !!user && !!token,
        error,

        login,
        register,
        logout,
        setError,
    };
}
