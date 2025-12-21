import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSetPassword } from "@/hooks/Auth/useSetPassword";
import { AlertCircle, CheckCircle } from "lucide-react";

export function SetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    const { setPassword: setPasswordMutation, loading, error, success } = useSetPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!token) {
            setValidationError("Token manquant. Vérifiez votre lien d'activation.");
            return;
        }

        if (password !== confirmPassword) {
            setValidationError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (password.length < 6) {
            setValidationError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        const result = await setPasswordMutation({
            token,
            password,
            confirmPassword
        });

        if (result) {
            setTimeout(() => navigate("/"), 3000);
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <AlertCircle size={24} />
                        <h1 className="text-xl font-bold">Erreur</h1>
                    </div>
                    <p className="text-gray-600">
                        Token manquant. Veuillez vérifier votre lien d'activation.
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex items-center gap-3 text-green-600 mb-4">
                        <CheckCircle size={24} />
                        <h1 className="text-xl font-bold">Succès !</h1>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Votre mot de passe a été défini avec succès. Vous allez être redirigé vers la page de connexion...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center">Activation du compte</h1>

                {(error || validationError) && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                        <AlertCircle size={20} />
                        <p>{error || validationError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Confirmez votre mot de passe"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Activation en cours..." : "Activer mon compte"}
                    </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-6">
                    Ce lien expire dans 24 heures.
                </p>
            </div>
        </div>
    );
}