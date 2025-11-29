import axiosInstance from "@/api/api";
import { AUTH_ROUTES } from "./routes";
import { User } from "../user/types";
import {
    LoginPayload,
    RegisterPayload,
    AuthResponse,
    InviteUserPayload,
    SetPasswordPayload
} from "./types";

function mapBackendToAuthResponse(data: any): AuthResponse {
    const user: User = {
        id: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        password: ""
    };

    return {
        user,
        token: data.token
    };
}

export const AuthService = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const res = await axiosInstance.post(AUTH_ROUTES.login, payload);
        return mapBackendToAuthResponse(res.data);
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const res = await axiosInstance.post(AUTH_ROUTES.register, payload);
        return mapBackendToAuthResponse(res.data);
    },

    invite: async (payload: InviteUserPayload): Promise<void> => {
        await axiosInstance.post(AUTH_ROUTES.invite, payload);
    },

    setPassword: async (payload: SetPasswordPayload): Promise<void> => {
        await axiosInstance.post(AUTH_ROUTES.setPassword, payload);
    }
};
