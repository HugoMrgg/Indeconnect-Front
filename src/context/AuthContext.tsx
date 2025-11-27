import React, { createContext, useState } from "react";
import { authStorage } from "./AuthStorage";
import { userStorage } from "./UserStorage";
import { User } from "@/api/services/user/types";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    userRole: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setTokenState] = useState<string | null>(authStorage.getToken());
    const [user, setUserState] = useState<User | null>(userStorage.getUser());

    const setToken = (value: string | null) => {
        setTokenState(value);
        if (value) authStorage.setToken(value);
        else authStorage.clearToken();
    };

    const setUser = (value: User | null) => {
        setUserState(value);
        if (value) userStorage.setUser(value);
        else userStorage.clear();
    };

    const userRole = user?.role ?? "Guest";

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};
