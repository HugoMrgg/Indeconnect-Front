import axiosInstance from "@/api/api";
import { User } from "./types";
import {routes} from "@/api/services/user/routes";

export const UsersService = {

    getById: async (id: number): Promise<User> => {
        const res = await axiosInstance.get(routes.getById+id);
        return res.data;
    }
};
