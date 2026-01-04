import { useState, useCallback } from "react";
import { AuthService } from "@/api/services/auth";
import { useAuthContext } from "@/hooks/Auth/useAuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/api/services/auth/types";

/**
 * Hook principal pour la gestion de l'authentification
 */
export function useAuth() {
    const { token, user, userRole, isLoading, login: loginContext, logout: logoutContext, setLoading } =
        useAuthContext();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    const googleAuth = useCallback(
        async (idToken: string): Promise<AuthResponse> => {
            setError(null);
            setLoading(true);

            try {
                const res = await AuthService.googleAuth({ idToken });

                loginContext(res.user, res.token);

                toast.success(`Bienvenue ${res.user.firstName}`, {
                    style: {
                        borderRadius: "10px",
                        background: "#000",
                        color: "#fff",
                    },
                });

                return res;
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Erreur d'authentification Google";
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
        googleAuth,
        logout,
        setError,
    };
}
