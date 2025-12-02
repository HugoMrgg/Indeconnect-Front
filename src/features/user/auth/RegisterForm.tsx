import React from "react";

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
                             }: RegisterFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 text-center">
                S'inscrire
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
                        Prénom
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => onFirstName(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Jean"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm text-gray-700 mb-1">
                        Nom
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => onLastName(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Dupont"
                    />
                </div>
            </div>

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

            <div className="grid grid-cols-2 gap-3">
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
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">
                        Confirmer
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => onConfirmPassword(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.98] font-medium"
                aria-busy={loading}
            >
                {loading ? "…" : "Créer mon compte"}
            </button>
        </form>
    );
}
