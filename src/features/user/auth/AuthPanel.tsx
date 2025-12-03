import React, { useEffect, useState } from "react";

import { useUI } from "@/context/UIContext";
import { useAuth } from "@/hooks/useAuth";

import { LoginForm } from "@/features/user/auth/LoginForm";
import { RegisterForm } from "@/features/user/auth/RegisterForm";

import { X } from "lucide-react";

export function AuthPanel() {
    const { authOpen, authMode, closeAuth } = useUI();
    const { login, register, googleAuth, user, isLoading, error } = useAuth();

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    // reset form when closing
    useEffect(() => {
        if (!authOpen) {
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setConfirmPassword("");
            setLocalError(null);
        }
    }, [authOpen]);

    // auto-close on successful register/login
    useEffect(() => {
        if (authOpen && user && !isLoading && !error) {
            closeAuth();
        }
    }, [authOpen, closeAuth, error, isLoading, user]);

    // ---------------------
    // LOGIN
    // ---------------------
    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        await login({ email, password });
    };

    // ---------------------
    // REGISTER
    // ---------------------
    const submitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (password !== confirmPassword) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
        }

        await register({
            email,
            firstName,
            lastName,
            password,
            confirmPassword,
            targetRole: "client",
        });
    };

    // ✅ NOUVEAU : GOOGLE AUTH
    const handleGoogleAuth = async (idToken: string) => {
        setLocalError(null);

        try {
            await googleAuth(idToken);
            // Le useEffect ci-dessus fermera automatiquement le panel
        } catch (err: any) {
            // L'erreur est déjà gérée dans le hook
            console.error("Google auth failed:", err);
        }
    };

    if (!authOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                onClick={closeAuth}
            />

            <div
                className="
                    absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[420px] max-w-[92vw] bg-white rounded-2xl shadow-2xl p-5
                "
            >
                <div className="flex justify-end">
                    <button
                        onClick={closeAuth}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {authMode === "login" ? (
                    <LoginForm
                        email={email}
                        password={password}
                        loading={isLoading}
                        error={error ?? localError}
                        onEmail={setEmail}
                        onPassword={setPassword}
                        onSubmit={submitLogin}
                        onGoogleLogin={handleGoogleAuth}
                    />
                ) : (
                    <RegisterForm
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        loading={isLoading}
                        error={error ?? localError}
                        onFirstName={setFirstName}
                        onLastName={setLastName}
                        onEmail={setEmail}
                        onPassword={setPassword}
                        onConfirmPassword={setConfirmPassword}
                        onSubmit={submitRegister}
                        onGoogleRegister={handleGoogleAuth}
                    />
                )}
            </div>
        </div>
    );
}
