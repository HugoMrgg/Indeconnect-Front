import { User } from "../user/types";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}