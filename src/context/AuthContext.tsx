import React, { createContext, useState } from "react";
import { authStorage } from "./AuthStorage";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setTokenState] = useState<string | null>(authStorage.getToken());

    const setToken = (value: string | null) => {
        setTokenState(value);
        if (value) authStorage.setToken(value);
        else authStorage.clearToken();
    };

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

