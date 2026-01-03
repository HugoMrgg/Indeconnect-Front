import React, { useReducer, useCallback, useEffect } from "react";
import { authStorage } from "@/storage/AuthStorage";
import { userStorage } from "@/storage/UserStorage";
import { AuthContext, type AuthContextType, type AuthState, type UserRole } from "../AuthContext";
import type { User } from "@/api/services/user/types";
import { logger } from "@/utils/logger";
import { setUser as setSentryUser } from "@/utils/sentry";

type AuthAction =
    | { type: "AUTH_LOGIN"; payload: { user: User; token: string } }
    | { type: "AUTH_LOGOUT" }
    | { type: "AUTH_SET_USER"; payload: User }
    | { type: "AUTH_RESTORE"; payload: { user: User | null; token: string | null } }
    | { type: "AUTH_SET_LOADING"; payload: boolean };

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    userRole: "Guest",
    isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "AUTH_LOGIN": {
            const userRole = (action.payload.user.role as UserRole) || "Guest";
            return {
                token: action.payload.token,
                user: action.payload.user,
                isAuthenticated: true,
                userRole,
                isLoading: false,
            };
        }

        case "AUTH_SET_USER": {
            const userRole = (action.payload.role as UserRole) || "Guest";
            return {
                ...state,
                user: action.payload,
                userRole,
            };
        }

        case "AUTH_LOGOUT": {
            authStorage.clearToken();
            userStorage.clear();
            return {
                token: null,
                user: null,
                isAuthenticated: false,
                userRole: "Guest",
                isLoading: false,
            };
        }

        case "AUTH_RESTORE": {
            if (!action.payload.token || !action.payload.user) {
                return {
                    ...state,
                    isLoading: false,
                };
            }

            const userRole = (action.payload.user.role as UserRole) || "Guest";
            return {
                token: action.payload.token,
                user: action.payload.user,
                isAuthenticated: true,
                userRole,
                isLoading: false,
            };
        }

        case "AUTH_SET_LOADING": {
            return {
                ...state,
                isLoading: action.payload,
            };
        }

        default:
            return state;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const restoreSession = () => {
            try {
                const token = authStorage.getToken();
                const user = userStorage.getUser();

                if (token && user) {
                    dispatch({ type: "AUTH_RESTORE", payload: { token, user } });
                    // Définir l'utilisateur dans Sentry pour le suivi
                    setSentryUser({
                        id: user.id,
                        email: user.email,
                        username: user.username || user.email,
                    });
                } else {
                    authStorage.clearToken();
                    userStorage.clear();
                    dispatch({ type: "AUTH_RESTORE", payload: { token: null, user: null } });
                    setSentryUser(null);
                }
            } catch (error) {
                logger.error("AuthProvider.restoreSession", error);
                authStorage.clearToken();
                userStorage.clear();
                dispatch({ type: "AUTH_RESTORE", payload: { token: null, user: null } });
                setSentryUser(null);
            }
        };

        restoreSession();
    }, []);

    const login = useCallback((user: User, token: string) => {
        authStorage.setToken(token);
        userStorage.setUser(user);
        dispatch({ type: "AUTH_LOGIN", payload: { user, token } });
        // Définir l'utilisateur dans Sentry pour le suivi
        setSentryUser({
            id: user.id,
            email: user.email,
            username: user.username || user.email,
        });
    }, []);

    const logout = useCallback(() => {
        dispatch({ type: "AUTH_LOGOUT" });
        // Supprimer l'utilisateur de Sentry
        setSentryUser(null);
    }, []);

    const setUser = useCallback((user: User | null) => {
        if (user) {
            userStorage.setUser(user);
            dispatch({ type: "AUTH_SET_USER", payload: user });
            // Mettre à jour l'utilisateur dans Sentry
            setSentryUser({
                id: user.id,
                email: user.email,
                username: user.username || user.email,
            });
        } else {
            userStorage.clear();
            dispatch({ type: "AUTH_LOGOUT" });
            setSentryUser(null);
        }
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: "AUTH_SET_LOADING", payload: loading });
    }, []);

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        setUser,
        setLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
