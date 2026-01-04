// src/utils/passwordValidation.ts

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'fair' | 'good' | 'strong';
}

export interface PasswordCriteria {
    minLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasDigit: boolean;
    hasSpecialChar: boolean;
}

export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    const criteria: PasswordCriteria = {
        minLength: password.length >= 8,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasDigit: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`~;]/.test(password),
    };

    if (!criteria.minLength) {
        errors.push("Le mot de passe doit contenir au moins 8 caractères");
    }
    if (!criteria.hasLowercase) {
        errors.push("Le mot de passe doit contenir au moins une lettre minuscule");
    }
    if (!criteria.hasUppercase) {
        errors.push("Le mot de passe doit contenir au moins une lettre majuscule");
    }
    if (!criteria.hasDigit) {
        errors.push("Le mot de passe doit contenir au moins un chiffre");
    }
    if (!criteria.hasSpecialChar) {
        errors.push("Le mot de passe doit contenir au moins un caractère spécial");
    }

    const validCount = Object.values(criteria).filter(Boolean).length;
    let strength: PasswordValidationResult['strength'] = 'weak';

    if (validCount === 5) strength = 'strong';
    else if (validCount >= 4) strength = 'good';
    else if (validCount >= 3) strength = 'fair';

    return {
        isValid: errors.length === 0,
        errors,
        strength,
    };
}

export function getPasswordCriteria(password: string): PasswordCriteria {
    return {
        minLength: password.length >= 8,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasDigit: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`~;]/.test(password),
    };
}
