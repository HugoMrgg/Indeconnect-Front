import React from "react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {useNavigate} from "react-router-dom";

import { LoginForm } from "@/features/user/UserLoginForm";
import { BackLink } from "@/components/ui/BackLink";
import {NavBar} from "@/features/navbar/NavBar";

export const LoginPage: React.FC = () => {
    const { login, error, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);

        if (!error) {
            navigate(-1);
        }
    };

    return (


    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="p-6 w-full">
            <BackLink />
        </div>

        <LoginForm
            email={email}
            password={password}
            loading={loading}
            error={error}
            onEmail={setEmail}
            onPassword={setPassword}
            onSubmit={onSubmit}
        />

        <NavBar/>
    </div>
    );
}
