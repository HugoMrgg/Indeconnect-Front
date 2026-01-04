import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { AuthService } from "@/api/services/auth";
import type { InviteAccountRequest } from "@/types/account";
import { validateInviteAccountForm, type ValidationErrors } from "@/utils/accountValidation";

interface UseInviteAccountReturn {
    invite: (data: InviteAccountRequest) => Promise<void>;
    reset: () => void;
    loading: boolean;
    error: string | null;
    success: boolean;
    validationErrors: ValidationErrors;
    formData: InviteAccountRequest | null;
}

export function useInviteAccount(onSuccess: () => void): UseInviteAccountReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState<InviteAccountRequest | null>(null);

    const invite = useCallback(async (data: InviteAccountRequest) => {
        setError(null);
        setValidationErrors({});
        setFormData(data);

        const errors = validateInviteAccountForm(data);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);
        try {
            await AuthService.invite(data);
            setSuccess(true);
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.message || "Erreur lors de l'invitation"
                : err instanceof Error
                    ? err.message
                    : "Erreur lors de l'invitation";

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Note: onSuccess sera appelé manuellement par la modal quand l'utilisateur clique sur "Fermer"
    // Pas de fermeture automatique après 2 secondes

    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
        setValidationErrors({});
        setLoading(false);
        setFormData(null);
    }, []);

    return {
        invite,
        reset,
        loading,
        error,
        success,
        validationErrors,
        formData
    };
}
