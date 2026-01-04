import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthService } from "@/api/services/auth";
import { AlertCircle, CheckCircle } from "lucide-react";
import { PasswordStrengthIndicator } from "@/features/user/auth/PasswordStrengthIndicator";
import { validatePassword } from "@/utils/passwordValidation";
import toast from "react-hot-toast";

export function SetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPasswordStrength, setShowPasswordStrength] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError(null);
        if (!passwordTouched) {
            setPasswordTouched(true);
        }
    };

    const handlePasswordFocus = () => {
        setShowPasswordStrength(true);
        setPasswordTouched(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("Token manquant. Vérifiez votre lien d'activation.");
            return;
        }

        if (password !== confirmPassword) {
            const msg = "Les mots de passe ne correspondent pas.";
            setError(msg);
            toast.error(msg);
            return;
        }

        // Validation du mot de passe
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            const errorMsg = passwordValidation.errors.join(". ");
            setError(errorMsg);

            // Afficher chaque erreur dans un toast
            passwordValidation.errors.forEach((err) => {
                toast.error(err, { duration: 4000 });
            });
            return;
        }

        setLoading(true);
        try {
            await AuthService.setPassword({
                token,
                password,
                confirmPassword
            });
            setSuccess(true);
            toast.success("Compte activé avec succès !");
            setTimeout(() => navigate("/"), 3000);
        } catch (err: any) {
            let msg = "Erreur lors de l'activation du compte.";

            // Parser les erreurs de l'API (format ASP.NET)
            if (err?.response?.data?.errors) {
                const apiErrors = err.response.data.errors;
                const errorMessages: string[] = [];

                Object.entries(apiErrors).forEach(([field, errors]: [string, any]) => {
                    if (Array.isArray(errors)) {
                        errors.forEach(errorMsg => {
                            errorMessages.push(errorMsg);
                        });
                    }
                });

                if (errorMessages.length > 0) {
                    msg = errorMessages.join(". ");
                }
            } else if (err?.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err?.response?.data?.error) {
                msg = err.response.data.error;
            } else if (err?.response?.data?.title) {
                msg = err.response.data.title;
            } else if (err instanceof Error) {
                msg = err.message;
            }

            setError(msg);
            toast.error(msg, { duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    // Validation visuelle
    const passwordsMatch = password === confirmPassword;
    const showPasswordMismatch = confirmPassword.length > 0 && !passwordsMatch;

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

                {/* Affichage amélioré des erreurs */}
                {error && (
                    <div className="flex items-start gap-2 bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            {error.split(". ").map((err, idx) => (
                                <div key={idx} className="mb-1 last:mb-0">
                                    • {err}
                                </div>
                            ))}
                        </div>
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
                            onChange={handlePasswordChange}
                            onFocus={handlePasswordFocus}
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
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError(null);
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                showPasswordMismatch
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-black'
                            }`}
                            placeholder="Confirmez votre mot de passe"
                            required
                        />
                        {showPasswordMismatch && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                Les mots de passe ne correspondent pas
                            </p>
                        )}
                    </div>

                    {/* Indicateur de force du mot de passe */}
                    <PasswordStrengthIndicator
                        password={password}
                        show={showPasswordStrength && passwordTouched}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.98]"
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