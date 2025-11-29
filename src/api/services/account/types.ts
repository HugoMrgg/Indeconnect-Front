// @/api/services/accounts/types.ts

/** Compte administratif (Admin, Moderator, SuperVendor) */
export type Account = {
    /** Identifiant unique du compte */
    id: number;

    /** Email du compte */
    email: string;

    /** Prénom du compte */
    firstName: string;

    /** Nom du compte */
    lastName: string;

    /** Rôle du compte */
    role: string;

    /** Indique si le compte est actif */
    isEnabled: boolean;

    /** Date de création du compte */
    createdAt: string;
};

export interface ToggleAccountStatusRequest {
    isEnabled: boolean;
}
