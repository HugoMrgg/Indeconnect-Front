import { useState } from "react";
import { AuthService } from "@/api/services/auth";
import { useAuthContext } from "@/hooks/useAuthContext";
import toast from "react-hot-toast";

import {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
} from "@/api/services/auth/types";
import {userStorage} from "@/context/UserStorage";


// ============================
//  Auth Hook
// ============================

export function useAuth() {
    const { token, setToken } = useAuthContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<AuthResponse["user"] | null>(null);

    // -------------------------
    // LOGIN
    // -------------------------
    const login = async (payload: LoginPayload): Promise<AuthResponse> => {
        setLoading(true);
        setError(null);

        try {
            const res: AuthResponse = await AuthService.login(payload);

            setToken(res.token);
            setUser(res.user);
            console.log("contenu user : "+res.user.role);
            userStorage.setUser(res.user);
            console.log("contenu userstorage getUser : "+userStorage.getUser()?.role);

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
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    // REGISTER
    // -------------------------
    const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
        setLoading(true);
        setError(null);

        try {
            const res: AuthResponse = await AuthService.register(payload);

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
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        toast.success("Déconnecté avec succès 👋");
    };

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

