import { User } from "@/api/services/user/types";

export const userStorage = {
    getUser: (): User | null => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    },

    setUser: (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
    },

    clear: () => localStorage.removeItem("user"),
};