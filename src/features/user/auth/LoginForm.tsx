import React from "react";

interface LoginFormProps {
    email: string;
    password: string;
    loading?: boolean;
    error?: string | null;
    onEmail: (value: string) => void;
    onPassword: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
                              email,
                              password,
                              loading = false,
                              error,
                              onEmail,
                              onPassword,
                              onSubmit,
                          }: LoginFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 text-center">
                Se connecter
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
                    Adresse mail
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="exemple@mail.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                    Mot de passe
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => onPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Votre mot de passe"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.98] font-medium"
                aria-busy={loading}
            >
                {loading ? "Connexion..." : "Se connecter"}
            </button>
        </form>
    );
}
