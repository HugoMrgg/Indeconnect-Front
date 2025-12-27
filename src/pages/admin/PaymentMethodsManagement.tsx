import React, { useState } from "react";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

export const PaymentMethodsManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const STRIPE_DASHBOARD_LIVE = "https://dashboard.stripe.com/settings/payment_methods";
    const STRIPE_DASHBOARD_TEST = "https://dashboard.stripe.com/test/settings/payment_methods";

    const openStripe = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <AuthPanel />

            <main className="relative bg-white min-h-screen mx-auto pb-16">
                <section className="bg-[#C9B38C] px-6 py-16 relative">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-start gap-6">
                            <div>
                                <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                                    Paramètres de paiement (Stripe)
                                </h1>
                                <div className="w-24 h-1 bg-gray-900 mb-6" aria-hidden="true"></div>
                                <p className="text-gray-700 text-lg">
                                    Ici, on ne gère pas les moyens de paiement en base de données : c’est Stripe qui décide.
                                    Tu actives/désactives les méthodes directement dans le Dashboard, et notre checkout s’adapte.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* body ici */}
                <section className="px-6 py-10">
                    <div className="max-w-6xl mx-auto gap-6 grid">
                        {/* Carte principale */}
                        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Gérer les moyens de paiement
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Active/désactive (Carte, PayPal, Bancontact, …) directement dans Stripe.
                                Aucun déploiement, aucun code à modifier.
                            </p>

                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                                <button
                                    type="button"
                                    onClick={() => openStripe(STRIPE_DASHBOARD_LIVE)}
                                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
                                >
                                    Ouvrir Stripe Dashboard (LIVE)
                                </button>

                                <button
                                    type="button"
                                    onClick={() => openStripe(STRIPE_DASHBOARD_TEST)}
                                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition"
                                >
                                    Ouvrir Stripe Dashboard (TEST)
                                </button>
                            </div>

                            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-gray-800 font-semibold mb-2">Comment ça marche côté app</p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Stripe décide quelles méthodes sont disponibles (selon tes réglages et l’éligibilité).</li>
                                    <li>Notre back crée un PaymentIntent avec <span className="font-mono">AutomaticPaymentMethods.Enabled = true</span>.</li>
                                    <li>Le front affiche automatiquement les méthodes proposées par Stripe (Payment Element).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* NavBar globale */}
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
};
