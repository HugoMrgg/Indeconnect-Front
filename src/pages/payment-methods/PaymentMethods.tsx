import React, { useState } from 'react';
import { usePaymentMethods } from '@/api/services/payments-methods';
import { CardForm } from './CardForm';
import {PaymentCardFormData, PaymentMethod} from "@/api/services/payments-methods/types";

// (Le composant BrandIcon reste identique à la version précédente, je l'omets ici pour la clarté)
const BrandIcon = ({ brand }: { brand: string }) => { /* ... voir réponse précédente ... */ return <span className="font-bold uppercase text-xs text-gray-600">{brand}</span> };


export const PaymentMethodsPage: React.FC = () => {
    const { data, isLoading, isAdding, error, addPaymentMethod, removePaymentMethod, setDefaultMethod } = usePaymentMethods();

    // État local pour gérer l'affichage du formulaire
    const [isShowingAddForm, setIsShowingAddForm] = useState(false);

    // Gestion de la soumission du formulaire
    const handleAddCardSubmit = async (formData: PaymentCardFormData) => {
        const success = await addPaymentMethod(formData);
        if (success) {
            // Si l'ajout a réussi, on cache le formulaire
            setIsShowingAddForm(false);
        }
        // Si échec, l'erreur est gérée par le hook et affichée plus bas
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Chargement de vos moyens de paiement...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Moyens de paiement</h1>
                <p className="text-gray-500 mt-1">Gérez vos cartes bancaires pour vos futurs achats.</p>
            </header>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* --- Zone de contenu principal : Soit la liste, soit le formulaire --- */}

            {isShowingAddForm ? (
                // 1. Affichage du formulaire d'ajout
                <CardForm
                    onSubmit={handleAddCardSubmit}
                    onCancel={() => setIsShowingAddForm(false)}
                    isSubmitting={isAdding}
                />
            ) : (
                // 2. Affichage de la liste et du bouton "Ajouter"
                <>
                    <div className="space-y-4">
                        {data.map((method: PaymentMethod) => (
                            <div
                                key={method.id}
                                className={`flex items-start justify-between p-4 border rounded-lg transition-colors bg-white ${
                                    method.isDefault ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'border-gray-200'
                                }`}
                            >
                                <div className="flex gap-4">
                                    {/* Icône générique de carte */}
                                    <div className={`w-12 h-8 rounded flex items-center justify-center ${method.brand === 'visa' ? 'bg-blue-100' : method.brand === 'mastercard' ? 'bg-red-100' : 'bg-gray-200'}`}>
                                        <BrandIcon brand={method.brand} />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-gray-900 font-mono">•••• {method.last4}</span>
                                            {method.isDefault && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Par défaut</span>}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Expire le {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear} • {method.holderName}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 ml-4">
                                    {!method.isDefault && (
                                        <button onClick={() => setDefaultMethod(method.id)} className="text-sm text-gray-600 hover:text-blue-600 px-2 py-1">
                                            Par défaut
                                        </button>
                                    )}
                                    <button onClick={() => removePaymentMethod(method.id)} className="text-sm text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded">
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}

                        {data.length === 0 && !isLoading && (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">Vous n'avez pas encore enregistré de carte.</p>
                            </div>
                        )}
                    </div>

                    {/* Bouton principal pour afficher le formulaire */}
                    <div className="pt-6">
                        <button
                            onClick={() => setIsShowingAddForm(true)}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            + Ajouter une nouvelle carte
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};