import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { logger } from "@/utils/logger";

interface RegisterFormProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    loading?: boolean;
    error?: string | null;
    onFirstName: (value: string) => void;
    onLastName: (value: string) => void;
    onEmail: (value: string) => void;
    onPassword: (value: string) => void;
    onConfirmPassword: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoogleRegister?: (idToken: string) => void;
}

export function RegisterForm({
                                 firstName,
                                 lastName,
                                 email,
                                 password,
                                 confirmPassword,
                                 loading = false,
                                 error,
                                 onFirstName,
                                 onLastName,
                                 onEmail,
                                 onPassword,
                                 onConfirmPassword,
                                 onSubmit,
                                 onGoogleRegister,
                             }: RegisterFormProps) {
    const { t } = useTranslation();
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            setGoogleLoading(true);

            try {
                onGoogleRegister?.(credentialResponse.credential);
            } finally {
                setGoogleLoading(false);
            }
        } else {
            logger.error("RegisterForm.handleGoogleSuccess", "No credential in response");
        }
    };

    const handleGoogleError = () => {
        logger.error("RegisterForm.handleGoogleError", "Google registration failed");
        setGoogleLoading(false);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 text-center">
                {t('auth.register.title')}
            </h1>

            {error && (
                <div
                    role="alert"
                    className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2"
                >
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="firstName" className="block text-sm text-gray-700 mb-1">
                        {t('auth.register.first_name_label')}
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => onFirstName(e.target.value)}
                        disabled={loading || googleLoading}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={t('auth.register.first_name_placeholder')}
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm text-gray-700 mb-1">
                        {t('auth.register.last_name_label')}
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => onLastName(e.target.value)}
                        disabled={loading || googleLoading}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={t('auth.register.last_name_placeholder')}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                    {t('auth.register.email_label')}
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmail(e.target.value)}
                    disabled={loading || googleLoading}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t('auth.register.email_placeholder')}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                        {t('auth.register.password_label')}
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => onPassword(e.target.value)}
                        disabled={loading || googleLoading}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={t('auth.register.password_placeholder')}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">
                        {t('auth.register.confirm_password_label')}
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => onConfirmPassword(e.target.value)}
                        disabled={loading || googleLoading}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={t('auth.register.confirm_password_placeholder')}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.98] font-medium"
                aria-busy={loading}
            >
                {loading ? t('auth.register.submitting') : t('auth.register.submit_button')}
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
                    text="signup_with"
                    shape="rectangular"
                    theme="outline"
                    locale="fr"
                />
            </div>
        </form>
    );
}
