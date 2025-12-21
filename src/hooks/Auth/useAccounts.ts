// useAccounts.ts
import {useCallback, useEffect, useRef, useState} from "react";
import {AxiosError} from "axios";
import {AccountsService} from "@/api/services/account";
import {InviteAccountRequest} from "@/types/account";
import {Account} from "@/api/services/account/types";

interface UseAccountsReturn {
    accounts: Account[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    toggleStatus: (accountId: number, currentStatus: boolean) => Promise<void>;
    resendInvitation: (data: InviteAccountRequest) => Promise<void>;
}

export function useAccounts(): UseAccountsReturn {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchAccounts = useCallback(async () => {
        // Annule la requête précédente si elle existe
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
            // ✅ Vérifie AVANT de logger
            if (err instanceof Error && err.name === "CanceledError") {
                return;
            }

            console.error("[useAccounts] Erreur chargement:", err);

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
    }, []); // ✅ VIDE pour éviter les re-créations

    const toggleAccountStatus = useCallback(
        async (accountId: number, currentStatus: boolean) => {
            try {
                await AccountsService.toggleStatus(
                    accountId,
                    !currentStatus,
                    abortControllerRef.current?.signal
                );
                await fetchAccounts();
            } catch (err) {
                if (err instanceof Error && err.name === "CanceledError") {
                    return;
                }

                const errorMessage =
                    err instanceof AxiosError
                        ? err.response?.data?.message || "Erreur lors de la mise à jour du compte"
                        : err instanceof Error
                            ? err.message
                            : "Erreur lors de la mise à jour du compte";

                setError(errorMessage);
                throw err;
            }
        },
        [fetchAccounts]
    );

    const resendInvitation = useCallback(
        async (data: InviteAccountRequest) => {
            try {
                await AccountsService.resendInvitation(
                    data,
                    abortControllerRef.current?.signal
                );
                await fetchAccounts();
            } catch (err) {
                if (err instanceof Error && err.name === "CanceledError") {
                    return;
                }

                const errorMessage =
                    err instanceof AxiosError
                        ? err.response?.data?.message || "Erreur lors de la réinvitation"
                        : err instanceof Error
                            ? err.message
                            : "Erreur lors de la réinvitation";

                setError(errorMessage);
                throw err;
            }
        },
        [fetchAccounts]
    );

    useEffect(() => {
        fetchAccounts();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    return {
        accounts,
        loading,
        error,
        refetch: fetchAccounts,
        toggleStatus: toggleAccountStatus,
        resendInvitation,
    };
}