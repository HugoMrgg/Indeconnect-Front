import React from "react";

type Props = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;

    loading?: boolean;
    error?: string | null;

    onFirstName: (v: string) => void;
    onLastName: (v: string) => void;
    onEmail: (v: string) => void;
    onPassword: (v: string) => void;
    onConfirmPassword: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
};

export function RegisterForm({
                                 firstName, lastName, email, password, confirmPassword,
                                 loading, error,
                                 onFirstName, onLastName, onEmail, onPassword, onConfirmPassword,
                                 onSubmit,
                             }: Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 text-center">S'inscrire</h1>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Prénom</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => onFirstName(e.target.value)}
                        required
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                        placeholder="Jean"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Nom</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => onLastName(e.target.value)}
                        required
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                        placeholder="Dupont"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">Adresse mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => onEmail(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    placeholder="exemple@mail.com"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => onPassword(e.target.value)}
                        required
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Confirmer</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => onConfirmPassword(e.target.value)}
                        required
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition active:scale-[0.98]"
            >
                {loading ? "…" : "Créer mon compte"}
            </button>
        </form>
    );
}
