// @/hooks/useInviteAccount.ts
import { useState, useCallback, useEffect } from "react";
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
}

export function useInviteAccount(onSuccess: () => void): UseInviteAccountReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const invite = useCallback(async (data: InviteAccountRequest) => {
        setError(null);
        setValidationErrors({});

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

    // Cleanup et callback de succès
    useEffect(() => {
        if (!success) return;

        const timer = setTimeout(() => {
            onSuccess();
        }, 2000);

        return () => clearTimeout(timer);
    }, [success, onSuccess]);

    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
        setValidationErrors({});
        setLoading(false);
    }, []);

    return {
        invite,
        reset,
        loading,
        error,
        success,
        validationErrors
    };
}
