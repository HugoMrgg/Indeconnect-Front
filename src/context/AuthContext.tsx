import React, { useState } from "react";
import { authStorage } from "./AuthStorage";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(authStorage.getToken());

    const setToken = (value: string | null) => {
        setTokenState(value);
        if (value) authStorage.setToken(value);
        else authStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}
