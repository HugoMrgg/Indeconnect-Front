import { useState, useCallback } from "react";
import { AuthService } from "@/api/services/auth";
import { SetPasswordPayload } from "@/api/services/auth/types";
import { extractErrorMessage } from "@/utils/errorHandling";
import toast from "react-hot-toast";

interface UseSetPasswordReturn {
    setPassword: (payload: SetPasswordPayload) => Promise<boolean>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export function useSetPassword(): UseSetPasswordReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const setPassword = useCallback(async (payload: SetPasswordPayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await AuthService.setPassword(payload);
            setSuccess(true);
            toast.success("Votre mot de passe a été défini avec succès !");
            return true;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            toast.error(message);
            console.error("[useSetPassword] error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        setPassword,
        loading,
        error,
        success,
    };
}
