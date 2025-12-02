import axiosInstance from "@/api/api";
import { routes } from "@/api/services/account/routes";
import type { Account, ToggleAccountStatusRequest } from "./types";
import type { InviteAccountRequest } from "@/types/account";

export const AccountsService = {
    /**
     * Récupère la liste de tous les comptes administratifs
     */
    getAll: async (signal?: AbortSignal): Promise<Account[]> => {
        const res = await axiosInstance.get<Account[]>(routes.list, { signal });
        return res.data ?? [];
    },

    /**
     * Active ou désactive un compte
     */
    toggleStatus: async (
        accountId: number,
        isEnabled: boolean,
        signal?: AbortSignal
    ): Promise<void> => {
        await axiosInstance.patch(
            routes.toggleStatus(accountId),
            { isEnabled } as ToggleAccountStatusRequest,
            { signal }
        );
    },

    /**
     * Renvoie une invitation à un compte en attente
     */
    resendInvitation: async (
        data: InviteAccountRequest,
        signal?: AbortSignal
    ): Promise<void> => {
        await axiosInstance.post(routes.resendInvitation, data, { signal });
    },
};
