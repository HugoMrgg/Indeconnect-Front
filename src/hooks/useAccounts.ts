import { useState, useEffect, useRef, useCallback } from "react";
import { AxiosError } from "axios";
import { AccountsService } from "@/api/services/account";
import type { Account } from "@/api/services/account/types";

interface UseAccountsReturn {
    accounts: Account[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    toggleStatus: (accountId: number, currentStatus: boolean) => Promise<void>;
}

export function useAccounts(): UseAccountsReturn {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchAccounts = useCallback(async () => {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);
            setError(null);
            const data = await AccountsService.getAll(abortControllerRef.current.signal);
            setAccounts(data);
        } catch (err) {
            // Type guard pour CanceledError
            if (err instanceof Error && err.name === "CanceledError") {
                return;
            }

            console.error("Erreur chargement comptes:", err);

            // Gestion des erreurs Axios
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Impossible de charger les comptes");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Impossible de charger les comptes");
            }

            setAccounts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleAccountStatus = useCallback(async (
        accountId: number,
        currentStatus: boolean
    ) => {
        try {
            await AccountsService.toggleStatus(accountId, !currentStatus);
            await fetchAccounts();
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.message || "Erreur lors de la mise à jour du compte"
                : err instanceof Error
                    ? err.message
                    : "Erreur lors de la mise à jour du compte";

            setError(errorMessage);
            throw err;
        }
    }, [fetchAccounts]);

    useEffect(() => {
        fetchAccounts();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchAccounts]);

    return {
        accounts,
        loading,
        error,
        refetch: fetchAccounts,
        toggleStatus: toggleAccountStatus
    };
}
