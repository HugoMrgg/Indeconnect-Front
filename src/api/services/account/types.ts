import { Role } from "@/types/account";

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
    role: Role;

    /** Indique si le compte est actif */
    isEnabled: boolean;

    /** Indique si le compte est en attente d'activation */
    isPendingActivation: boolean;

    /** Date de création du compte */
    createdAt: string;
};

export interface ToggleAccountStatusRequest {
    isEnabled: boolean;
}

export interface ResendInvitationRequest {
    email: string;
}
