// src/pages/payment-methods/CardForm.tsx
import React, { useState } from 'react';
import {PaymentCardFormData} from "@/api/services/payments-methods/types";

// Utility functions for UX testing
const generateFakeCardNumber = (): string => {
    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    return `${randomDigits()} ${randomDigits()} ${randomDigits()} ${randomDigits()}`;
};

const generateFakeName = (): string => {
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Thomas', 'Julie'];
    const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand'];
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${randomFirst} ${randomLast}`;
};

interface CardFormProps {
    onSubmit: (data: PaymentCardFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export const CardForm: React.FC<CardFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
    // État local du formulaire
    const [formData, setFormData] = useState<PaymentCardFormData>({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        holderName: ''
    });

    // Fonction du bouton "Random" pour l'UX-First
    const fillRandomly = () => {
        const expMonth = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
        const expYear = (Math.floor(Math.random() * 5) + 24).toString(); // Année entre 24 et 29

        setFormData({
            cardNumber: generateFakeCardNumber(),
            expiryDate: `${expMonth}/${expYear}`,
            cvc: Math.floor(100 + Math.random() * 900).toString(),
            holderName: generateFakeName()
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation très basique pour l'UX
        if(!formData.cardNumber || !formData.expiryDate || !formData.cvc) return;
        onSubmit(formData);
    };

    // Styles Tailwind communs pour les inputs
    const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border";

    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Nouvelle carte</h2>
                {/* BOUTON MAGIQUE POUR L'UX-FIRST */}
                <button type="button" onClick={fillRandomly} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
                    ✨ Remplissage aléatoire (Test UX)
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Nom du titulaire */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom du titulaire</label>
                    <input
                        type="text"
                        value={formData.holderName}
                        onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                        className={inputClasses}
                        placeholder="Jean Dupont"
                    />
                </div>

                {/* Numéro de carte */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Numéro de carte</label>
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                            className={`${inputClasses} pr-10`}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {/* Petite icône de cadenas */}
                            <span className="text-gray-400">🔒</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Date d'expiration */}
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Expiration (MM/AA)</label>
                        <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                            className={inputClasses}
                            placeholder="MM/AA"
                            maxLength={5}
                        />
                    </div>
                    {/* CVC */}
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">CVC</label>
                        <input
                            type="text"
                            value={formData.cvc}
                            onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                            className={inputClasses}
                            placeholder="123"
                            maxLength={4}
                        />
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Annuler
                    </button>
                    <button type="submit" disabled={isSubmitting} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-70">
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Traitement sécurisé...
                    </span>
                        ) : "Enregistrer la carte"}
                    </button>
                </div>
            </form>
        </div>
    );
};