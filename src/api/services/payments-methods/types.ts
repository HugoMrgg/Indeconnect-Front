export type PaymentBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

// Ce qui est stocké en base (et renvoyé par l'API plus tard)
export interface PaymentMethod {
    id: string;
    brand: PaymentBrand;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
    holderName: string;
}

// Les données brutes saisies dans le formulaire d'ajout
export interface PaymentCardFormData {
    cardNumber: string; // Le numéro complet (16 chiffres)
    expiryDate: string; // Format MM/YY pour la saisie
    cvc: string;
    holderName: string;
}

export interface PaymentMethodsState {
    data: PaymentMethod[];
    isLoading: boolean;
    isAdding: boolean;
    error: string | null;
}