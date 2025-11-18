import { User } from "../user/types";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    firstName?: string;
    lastName?: string;
    password: string;
    confirmPassword: string;
    targetRole?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    /*refreshToken?: string;*/
}