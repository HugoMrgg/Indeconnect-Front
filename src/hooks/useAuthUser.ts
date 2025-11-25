import { User } from "@/api/services/user/types";
import {userStorage} from "@/context/UserStorage";
import {authStorage} from "@/context/AuthStorage";

export function useAuthUser(): {
    user: User | null;
    token: string | null;
    userId: number | null;
    isLoggedIn: boolean;
} {
    const user = userStorage.getUser();
    const token = authStorage.getToken();

    return {
        user,
        token,
        userId: user?.id ?? null,
        isLoggedIn: !!token && !!user,
    };
}

// non utilisé a l'heure actuelle
