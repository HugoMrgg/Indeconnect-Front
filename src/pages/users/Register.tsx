import { useState } from "react";
import React from "react";
import {useNavigate} from "react-router-dom";

import { BackLink } from "@/components/ui/BackLink";
import {NavBar} from "@/features/navbar/NavBar";

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: replace with your API call
        console.log("Register attempt:", { email, password });

        // exemple de redirection après succès
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="p-6">
                <BackLink />
                {/* reste du contenu */}
            </div>

            <div className="w-full max-w-sm bg-white shadow-md rounded-2xl p-6 space-y-6">

                <h1 className="text-2xl font-semibold text-gray-900 text-center">
                    Créer un compte
                </h1>

                <form onSubmit={onSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Prénom
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                            placeholder="prénom"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Nom
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                            placeholder="nom"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Adresse mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                            placeholder="exemple@mail.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                            placeholder="Votre mot de passe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                            placeholder="Votre mot de passe"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition active:scale-[0.98]"
                    >
                        S’inscrire
                    </button>
                </form>

                {/* Switch to Login */}
                <p className="text-center text-sm text-gray-600">
                    Déjà un compte ?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-black font-medium hover:underline"
                    >
                        Se connecter
                    </button>
                </p>
            </div>

            <NavBar/>
        </div>
    );
}
