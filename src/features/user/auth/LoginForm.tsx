import React from "react";

type Props = {
    email: string;
    password: string;
    loading?: boolean;
    error?: string | null;
    onEmail: (v: string) => void;
    onPassword: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
};

export function LoginForm({
                              email,
                              password,
                              loading,
                              error,
                              onEmail,
                              onPassword,
                              onSubmit,
                          }: Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">

            <h1 className="text-xl font-semibold text-gray-900 text-center">
                Se connecter
            </h1>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                    {error}
                </p>
            )}

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    Adresse mail
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => onEmail(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    placeholder="exemple@mail.com"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    Mot de passe
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => onPassword(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    placeholder="Votre mot de passe"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition active:scale-[0.98]"
            >
                {loading ? "Connexion..." : "Se connecter"}
            </button>
        </form>
    );
}
