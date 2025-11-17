import { useState } from "react";

import { User } from "@/types/users";
import { login as apiLogin, register as apiRegister } from "@/api/usersApi";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function login(email: string, password: string) {
        setLoading(true); setError(null);
        const result = await apiLogin(email, password);
        if (result) setUser(result); else setError("Email ou mot de passe incorrect");
        setLoading(false);
    }

    async function register(payload: { email: string; password: string; first_name: string; last_name: string; }) {
        setLoading(true); setError(null);
        const result = await apiRegister(payload);
        if (result) setUser(result); else setError("Impossible de créer le compte");
        setLoading(false);
    }

    function logout() { setUser(null); }

    return { user, login, register, logout, loading, error };
}
