/*
// src/pages/payment-methods/index.ts
import { useState, useEffect, useCallback } from 'react';
import { PaymentMethod, PaymentMethodsState } from './types';

// Données fictives pour démarrer (Mocks)
const MOCK_DATA: PaymentMethod[] = [
    { id: '1', brand: 'visa', last4: '4242', expiryMonth: 12, expiryYear: 2025, isDefault: true, holderName: 'John Doe' },
    { id: '2', brand: 'mastercard', last4: '8888', expiryMonth: 4, expiryYear: 2026, isDefault: false, holderName: 'John Doe' },
];

const usePaymentMethods = () => {
    const [state, setState] = useState<PaymentMethodsState>({
        data: [],
        isLoading: true, // On commence par charger
        isAdding: false,
        error: null,
    });

    // Simulation du chargement initial (GET)
    useEffect(() => {
        const fetchMethods = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Latence artificielle 1s
                setState((prev) => ({ ...prev, data: MOCK_DATA, isLoading: false }));
            } catch (err) {
                setState((prev) => ({ ...prev, isLoading: false, error: "Erreur de chargement" }));
            }
        };
        fetchMethods();
    }, []);

    // Simulation ajout carte (POST)
    const addPaymentMethod = async (newCard: Omit<PaymentMethod, 'id'>) => {
        setState((prev) => ({ ...prev, isAdding: true, error: null }));

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Latence un peu plus longue pour un ajout

            const newEntry: PaymentMethod = { ...newCard, id: Math.random().toString(36).substr(2, 9) };

            setState((prev) => ({
                ...prev,
                data: [...prev.data, newEntry],
                isAdding: false,
            }));
            return true; // Succès
        } catch (err) {
            setState((prev) => ({ ...prev, isAdding: false, error: "Impossible d'ajouter la carte" }));
            return false;
        }
    };

    // Simulation suppression (DELETE)
    const removePaymentMethod = async (id: string) => {
        // Optimistic UI : On supprime visuellement tout de suite
        const previousData = state.data;
        setState((prev) => ({ ...prev, data: prev.data.filter((m) => m.id !== id) }));

        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            // Si backend ok, rien à faire de plus
        } catch (err) {
            // Rollback si erreur
            setState((prev) => ({ ...prev, data: previousData, error: "Erreur lors de la suppression" }));
        }
    };

    // Simulation définition par défaut (PATCH)
    const setDefaultMethod = async (id: string) => {
        setState((prev) => ({
            ...prev,
            data: prev.data.map((m) => ({ ...m, isDefault: m.id === id }))
        }));
        // Note: Dans une vraie app, on ferait aussi un appel API ici
    };

    return {
        ...state,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultMethod,
    };
};
export default usePaymentMethods*/
import { useState, useEffect } from 'react';
import {
    PaymentBrand,
    PaymentCardFormData,
    PaymentMethod,
    PaymentMethodsState
} from "@/api/services/payments-methods/types";


// --- Helpers pour la simulation UX ---

// Détection très basique de la marque (suffisant pour l'UX)
const detectBrand = (number: string): PaymentBrand => {
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
};

// Générateur de faux numéro (juste une suite de chiffres)
export const generateFakeCardNumber = () => {
    let num = (Math.floor(Math.random() * 4) + 3).toString(); // Commence par 3, 4 ou 5
    for (let i = 0; i < 15; i++) num += Math.floor(Math.random() * 10);
    return num
        .replace(/\W/gi, '')
        .replace(/(.{4})/g, '$1 ')
        .trim(); // Ajoute des espaces pour le format visuel
};

export const generateFakeName = () => {
    const names = ['Jean Dupont', 'Marie Curie', 'John Smith', 'Sarah Connor'];
    return names[Math.floor(Math.random() * names.length)];
};
// ------------------------------------


// MOCK DATA INITIALES
const MOCK_DATA: PaymentMethod[] = [
    { id: '1', brand: 'visa', last4: '4242', expiryMonth: 12, expiryYear: 25, isDefault: true, holderName: 'Jean Dupont' },
];

export const usePaymentMethods = () => {
    const [state, setState] = useState<PaymentMethodsState>({
        data: [],
        isLoading: true,
        isAdding: false,
        error: null,
    });

    // Simulation GET initial
    useEffect(() => {
        const fetchMethods = async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            setState((prev) => ({ ...prev, data: MOCK_DATA, isLoading: false }));
        };
        fetchMethods();
    }, []);


    // Simulation POST (Ajout avec traitement des données du formulaire)
    const addPaymentMethod = async (formData: PaymentCardFormData): Promise<boolean> => {
        setState((prev) => ({ ...prev, isAdding: true, error: null }));

        try {
            // Simulation d'un appel vers un service de paiement sécurisé (Stripe, etc.)
            // C'est plus long qu'un simple appel API standard.
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // --- Logique backend simulée ---
            const cleanNumber = formData.cardNumber.replace(/\s/g, '');
            const brand = detectBrand(cleanNumber);
            const last4 = cleanNumber.slice(-4);
            const [expMonthStr, expYearStr] = formData.expiryDate.split('/');

            const newEntry: PaymentMethod = {
                id: Math.random().toString(36).substr(2, 9),
                brand: brand,
                last4: last4,
                expiryMonth: parseInt(expMonthStr, 10),
                expiryYear: parseInt(expYearStr, 10),
                isDefault: state.data.length === 0, // Si c'est la première carte, elle devient par défaut
                holderName: formData.holderName
            };
            // -------------------------------

            setState((prev) => ({
                ...prev,
                data: [...prev.data, newEntry],
                isAdding: false,
            }));
            return true;

        } catch (err) {
            setState((prev) => ({ ...prev, isAdding: false, error: "Échec de l'enregistrement de la carte." }));
            return false;
        }
    };

    // Simulation DELETE (Optimistic UI)
    const removePaymentMethod = async (id: string) => {
        //const previousData = state.data;
        setState((prev) => ({ ...prev, data: prev.data.filter((m) => m.id !== id) }));
        // Rollback si nécessaire dans un vrai catch...
    };

    // Simulation PATCH Default
    const setDefaultMethod = async (id: string) => {
        setState((prev) => ({
            ...prev,
            data: prev.data.map((m) => ({ ...m, isDefault: m.id === id }))
        }));
    };

    return { ...state, addPaymentMethod, removePaymentMethod, setDefaultMethod };
};