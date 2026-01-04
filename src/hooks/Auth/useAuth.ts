// src/hooks/Auth/useAuth.ts

import { useState, useCallback } from "react";
import { AuthService } from "@/api/services/auth";
import { useAuthContext } from "@/hooks/Auth/useAuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { validatePassword } from "@/utils/passwordValidation";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/api/services/auth/types";
import { useTranslation } from "react-i18next";

export function useAuth() {
    const { t } = useTranslation();
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
            } catch (err: any) {
                let msg = "Erreur de connexion";

                // Parser les erreurs de l'API
                if (err?.response?.data?.errors) {
                    const apiErrors = err.response.data.errors;
                    const errorMessages: string[] = [];

                    Object.values(apiErrors).forEach((errors: any) => {
                        if (Array.isArray(errors)) {
                            errorMessages.push(...errors);
                        }
                    });

                    if (errorMessages.length > 0) {
                        msg = errorMessages.join(". ");
                    }
                } else if (err?.response?.data?.message) {
                    msg = err.response.data.message;
                } else if (err?.response?.data?.title) {
                    msg = err.response.data.title;
                } else if (err instanceof Error) {
                    msg = err.message;
                }

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
            } catch (err: any) {
                let msg = "Erreur lors de l'inscription";

                // Parser les erreurs de validation de l'API (format ASP.NET)
                if (err?.response?.data?.errors) {
                    const apiErrors = err.response.data.errors;
                    const errorMessages: string[] = [];

                    // Le backend renvoie { "Password": ["error1", "error2"], "Email": ["error3"] }
                    Object.entries(apiErrors).forEach(([field, errors]: [string, any]) => {
                        if (Array.isArray(errors)) {
                            errors.forEach(errorMsg => {
                                errorMessages.push(errorMsg);
                            });
                        }
                    });

                    if (errorMessages.length > 0) {
                        msg = errorMessages.join(". ");
                    }
                } else if (err?.response?.data?.message) {
                    msg = err.response.data.message;
                } else if (err?.response?.data?.title) {
                    msg = err.response.data.title;
                } else if (err instanceof Error) {
                    msg = err.message;
                }

                setError(msg);

                // Afficher l'erreur dans un toast
                toast.error(msg, { duration: 5000 });

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
            } catch (err: any) {
                let msg = "Erreur d'authentification Google";

                if (err?.response?.data?.message) {
                    msg = err.response.data.message;
                } else if (err instanceof Error) {
                    msg = err.message;
                }

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
