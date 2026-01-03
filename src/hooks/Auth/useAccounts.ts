// useAccounts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccountsService } from "@/api/services/account";
import { InviteAccountRequest } from "@/types/account";
import { Account } from "@/api/services/account/types";

interface UseAccountsReturn {
    accounts: Account[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    toggleStatus: (accountId: number, currentStatus: boolean) => Promise<void>;
    resendInvitation: (data: InviteAccountRequest) => Promise<void>;
}

export function useAccounts(): UseAccountsReturn {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['accounts'],
        queryFn: async ({ signal }) => {
            return await AccountsService.getAll(signal);
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ accountId, currentStatus }: { accountId: number; currentStatus: boolean }) => {
            await AccountsService.toggleStatus(accountId, !currentStatus);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });

    const resendInvitationMutation = useMutation({
        mutationFn: async (data: InviteAccountRequest) => {
            await AccountsService.resendInvitation(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });

    const handleToggleStatus = async (accountId: number, currentStatus: boolean) => {
        try {
            await toggleStatusMutation.mutateAsync({ accountId, currentStatus });
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? err.response?.data?.message || "Erreur lors de la mise à jour du compte"
                    : err instanceof Error
                        ? err.message
                        : "Erreur lors de la mise à jour du compte";
            throw new Error(errorMessage);
        }
    };

    const handleResendInvitation = async (data: InviteAccountRequest) => {
        try {
            await resendInvitationMutation.mutateAsync(data);
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? err.response?.data?.message || "Erreur lors de la réinvitation"
                    : err instanceof Error
                        ? err.message
                        : "Erreur lors de la réinvitation";
            throw new Error(errorMessage);
        }
    };

    return {
        accounts: data ?? [],
        loading: isLoading,
        error: error ? "Impossible de charger les comptes" : null,
        refetch,
        toggleStatus: handleToggleStatus,
        resendInvitation: handleResendInvitation,
    };
}