import { useState } from "react";
import { User } from "@/types/users";
import { login as loginUser } from "@/api/usersApi";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function login(email: string, password: string) {
        setLoading(true);
        setError(null);

        const result = await loginUser(email, password);

        if (result !== null) {
            setUser(result);
        } else {
            setError("Email ou mot de passe incorrect");
        }

        setLoading(false);
    }

    function logout() {
        setUser(null);
    }

    return { user, login, logout, loading, error };
}
