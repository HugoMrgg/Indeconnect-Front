/*import { useState } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import { AuthService } from "@/api/services/auth";
import { LoginPayload, RegisterPayload, AuthResponse } from "@/api/services/auth/types";

export function useAuth() {
    const { token, setToken } = useAuthContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<AuthResponse["user"] | null>(null);

    const login = async (payload: LoginPayload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await AuthService.login(payload);
            setToken(res.token);
            setUser(res.user);
            return res;
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Login error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (payload: RegisterPayload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await AuthService.register(payload);
            setToken(res.token);
            setUser(res.user);
            return res;
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Register error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        token,
        user,
        loading,
        error,
        login,
        register
    };
}*/

import { useState } from "react";
import { AuthService } from "@/api/services/auth";
import { useAuthContext } from "@/context/useAuthContext";

import {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
} from "@/api/services/auth/types";


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

    return {
        token,
        user,
        loading,
        error,
        login,
        register,
    };
}

