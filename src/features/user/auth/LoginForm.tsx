import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { logger } from "@/utils/logger";

interface LoginFormProps {
    email: string;
    password: string;
    loading?: boolean;
    error?: string | null;
    onEmail: (value: string) => void;
    onPassword: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoogleLogin?: (idToken: string) => void;
}

export function LoginForm({
                              email,
                              password,
                              loading = false,
                              error,
                              onEmail,
                              onPassword,
                              onSubmit,
                              onGoogleLogin,
                          }: LoginFormProps) {
    const { t } = useTranslation();
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            setGoogleLoading(true);

            try {
                onGoogleLogin?.(credentialResponse.credential);
            } finally {
                setGoogleLoading(false);
            }
        } else {
            logger.error("LoginForm.handleGoogleSuccess", "No credential in response");
        }
    };

    const handleGoogleError = () => {
        logger.error("LoginForm.handleGoogleError", "Google login failed");
        setGoogleLoading(false);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 text-center">
                {t('auth.login.title')}
            </h1>

            {error && (
                <div
                    role="alert"
                    className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2"
                >
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                    {t('auth.login.email_label')}
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmail(e.target.value)}
                    disabled={loading || googleLoading}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t('auth.login.email_placeholder')}
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                    {t('auth.login.password_label')}
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => onPassword(e.target.value)}
                    disabled={loading || googleLoading}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t('auth.login.password_placeholder')}
                />
            </div>

            <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.98] font-medium"
                aria-busy={loading}
            >
                {loading ? t('auth.login.submitting') : t('auth.login.submit_button')}
            </button>
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-500">{t('common.or')}</span>
                <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    theme="outline"
                    locale="fr"
                />
            </div>
        </form>
    );
}
