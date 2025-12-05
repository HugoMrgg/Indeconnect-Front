import type { InviteAccountRequest } from "@/types/account";

export interface ValidationErrors {
    email?: string;
    firstName?: string;
    lastName?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInviteAccountForm(data: InviteAccountRequest): ValidationErrors {
    const errors: ValidationErrors = {};

    // Email validation
    if (!data.email.trim()) {
        errors.email = "L'email est obligatoire";
    } else if (!EMAIL_REGEX.test(data.email)) {
        errors.email = "Format d'email invalide";
    }

    // FirstName validation
    if (!data.firstName.trim()) {
        errors.firstName = "Le prénom est obligatoire";
    } else if (data.firstName.trim().length < 2) {
        errors.firstName = "Le prénom doit contenir au moins 2 caractères";
    }

    // LastName validation
    if (!data.lastName.trim()) {
        errors.lastName = "Le nom est obligatoire";
    } else if (data.lastName.trim().length < 2) {
        errors.lastName = "Le nom doit contenir au moins 2 caractères";
    }

    return errors;
}
