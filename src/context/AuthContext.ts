// @/context/AuthContext.ts
import { createContext } from "react";
import type { User } from "@/api/services/user/types";

export type UserRole = "Administrator" | "Moderator" | "SuperVendor" | "Vendor" | "Client" | "Guest";

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    userRole: UserRole;
    isLoading: boolean;
}

export type AuthAction =
    | { type: "AUTH_LOGIN"; payload: { user: User; token: string } }
    | { type: "AUTH_LOGOUT" }
    | { type: "AUTH_SET_USER"; payload: User }
    | { type: "AUTH_RESTORE"; payload: { user: User | null; token: string | null } }
    | { type: "AUTH_SET_LOADING"; payload: boolean };

export interface AuthContextType extends AuthState {
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
