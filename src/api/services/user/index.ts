import axiosInstance from "@/api/api";
import { User } from "./types";
import {routes} from "@/api/services/user/routes";

/**
 * UsersService - Reserved for future use
 *
 * This service is currently defined but not actively used in the application.
 * It provides user-related API methods that may be utilized in future features.
 */
export const UsersService = {

    getById: async (id: number): Promise<User> => {
        const res = await axiosInstance.get(routes.getById+id);
        return res.data;
    }
};
