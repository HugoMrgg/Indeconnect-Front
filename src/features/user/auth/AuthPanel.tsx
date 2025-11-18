/*
import { useEffect, useState } from "react";

import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import { LoginForm } from "@/features/user/auth/LoginForm";
import { RegisterForm } from "@/features/user/auth/RegisterForm";

import { X } from "lucide-react";

export function AuthPanel() {
    const { authOpen, authMode, closeAuth } = useUI();
    const { user, loading, error } = useAuth();
    const { login, register } = useAuthActions()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        if (!authOpen) {
            setEmail(""); setPassword("");
            setFirstName(""); setLastName(""); setConfirmPassword("");
            setLocalError(null);
        }
    }, [authOpen]);

    useEffect(() => {
        if (authOpen && user && !loading && !error) {
            closeAuth();
        }
    }, [user, loading, error, authOpen, closeAuth]);

    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        await login(email, password);
    };

    const submitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (password !== confirmPassword) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!register) {
            setLocalError("L’inscription n’est pas disponible dans cette build.");
            return;
        }

        await register({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
        });
    };

    return authOpen ? (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={closeAuth} />

            <div className="
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                w-[420px] max-w-[92vw] bg-white rounded-2xl shadow-2xl p-5
            ">
                <div className="flex justify-end">
                    <button onClick={closeAuth} className="p-2 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {authMode === "login" ? (
                    <LoginForm
                        email={email}
                        password={password}
                        loading={loading}
                        error={error ?? localError}
                        onEmail={setEmail}
                        onPassword={setPassword}
                        onSubmit={submitLogin}
                    />
                ) : (
                    <RegisterForm
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        loading={loading}
                        error={error ?? localError}
                        onFirstName={setFirstName}
                        onLastName={setLastName}
                        onEmail={setEmail}
                        onPassword={setPassword}
                        onConfirmPassword={setConfirmPassword}
                        onSubmit={submitRegister}
                    />
                )}
            </div>
        </div>
    ) : null;
}*//*
import { useEffect, useState } from "react";

import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";        // get user/loading/error/token
import { useAuthActions } from "@/hooks/useAuth";       // login/register actions

import { LoginForm } from "@/features/user/auth/LoginForm";
import { RegisterForm } from "@/features/user/auth/RegisterForm";

import { X } from "lucide-react";

export function AuthPanel() {
    const { authOpen, authMode, closeAuth } = useUI();
    const { login, register, loading, error, user } = useAuthActions();

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

    // auto-close on successful login/register
    useEffect(() => {
        if (authOpen && user && !loading && !error) {
            closeAuth();
        }
    }, [user, loading, error, authOpen, closeAuth]);

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
            password,
            firstName: firstName,
            lastName: lastName,
        });
    };

    return authOpen ? (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                onClick={closeAuth}
            />

            <div className="
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                w-[420px] max-w-[92vw] bg-white rounded-2xl shadow-2xl p-5
            ">
                <div className="flex justify-end">
                    <button onClick={closeAuth} className="p-2 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {authMode === "login" ? (
                    <LoginForm
                        email={email}
                        password={password}
                        loading={loading}
                        error={error ?? localError}
                        onEmail={setEmail}
                        onPassword={setPassword}
                        onSubmit={submitLogin}
                    />
                ) : (
                    <RegisterForm
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        loading={loading}
                        error={error ?? localError}
                        onFirstName={setFirstName}
                        onLastName={setLastName}
                        onEmail={setEmail}
                        onPassword={setPassword}
                        onConfirmPassword={setConfirmPassword}
                        onSubmit={submitRegister}
                    />
                )}
            </div>
        </div>
    ) : null;
}*/
// src/features/user/auth/AuthPanel.tsx
import React, { useEffect, useState } from "react";

import { useUI } from "@/context/UIContext";
import { useAuth } from "@/hooks/useAuth";

import { LoginForm } from "@/features/user/auth/LoginForm";
import { RegisterForm } from "@/features/user/auth/RegisterForm";

import { X } from "lucide-react";

export function AuthPanel() {
    const { authOpen, authMode, closeAuth } = useUI();
    const { login, register, user, loading, error } = useAuth();

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

    // auto-close on successful login/register
    useEffect(() => {
        if (authOpen && user && !loading && !error) {
            closeAuth();
        }
    }, [user, loading, error, authOpen, closeAuth]);

    // ---------------------
    // LOGIN
    // ---------------------
    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        await login({ email, password }); // LoginPayload
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
            password,
            // adapte les clés à RegisterPayload
            first_name: firstName,
            last_name: lastName,
        } as any);
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
                        loading={loading}
                        error={error ?? localError}
                        onEmail={setEmail}
                        onPassword={setPassword}
                        onSubmit={submitLogin}
                    />
                ) : (
                    <RegisterForm
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        loading={loading}
                        error={error ?? localError}
                        onFirstName={setFirstName}
                        onLastName={setLastName}
                        onEmail={setEmail}
                        onPassword={setPassword}
                        onConfirmPassword={setConfirmPassword}
                        onSubmit={submitRegister}
                    />
                )}
            </div>
        </div>
    );
}
