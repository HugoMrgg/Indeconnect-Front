// Les données brutes saisies dans le formulaire d'ajout
export interface PaymentCardFormData {
    cardNumber: string; // Le numéro complet (16 chiffres)
    expiryDate: string; // Format MM/YY pour la saisie
    cvc: string;
    holderName: string;
}

export type PaymentMethodType = "card" | "paypal" | string;

export type PaymentMethodDto = {
    id: string;
    type: PaymentMethodType;
    brand: string;
    last4?: string | null;
    expiryMonth?: number | null;
    expiryYear?: number | null;
    isDefault: boolean;
};

export type SetupIntentResponse = {
    clientSecret: string;
};
