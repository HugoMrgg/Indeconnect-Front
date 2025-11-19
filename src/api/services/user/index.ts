import axiosInstance from "@/api/api";
import { User } from "./types";

export const UsersService = {
    me: async (): Promise<User> => {
        const res = await axiosInstance.get("/users/me");
        return res.data;
    },

    getById: async (id: number): Promise<User> => {
        const res = await axiosInstance.get(`/users/${id}`);
        return res.data;
    },

    update: async (id: number, payload: Partial<User>): Promise<User> => {
        const res = await axiosInstance.put(`/users/${id}`, payload);
        return res.data;
    }
};
