import axiosInstance from "@/api/api";
import { AUTH_ROUTES } from "./routes";
import {
    LoginPayload,
    RegisterPayload,
    AuthResponse
} from "./types";

export const AuthService = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post(AUTH_ROUTES.login, payload);
        return data;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post(AUTH_ROUTES.register, payload);
        return data;
    },

    me: async (): Promise<AuthResponse> => {
        const { data } = await axiosInstance.get(AUTH_ROUTES.me);
        return data;
    }
};
