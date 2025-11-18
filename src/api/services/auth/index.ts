import axiosInstance from "@/api/api";
import { AUTH_ROUTES } from "./routes";
import {User} from "../user/types";

import {
    LoginPayload,
    RegisterPayload,
    AuthResponse
} from "./types";

function mapBackendToAuthResponse(data: any): AuthResponse {
    const user: User = {
        id: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        password: "" // le backend doit l'envoyer?
    };

    return {
        user,
        token: data.token
    };
}

export const AuthService = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const res = await axiosInstance.post(AUTH_ROUTES.login, payload);
        const data = mapBackendToAuthResponse(res.data);
        console.log(data);
        return data;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const res = await axiosInstance.post(AUTH_ROUTES.register, payload);
        return mapBackendToAuthResponse(res.data);
    },

    me: async (): Promise<AuthResponse> => {
        const res = await axiosInstance.get(AUTH_ROUTES.me);
        return mapBackendToAuthResponse(res.data);
    }
};
