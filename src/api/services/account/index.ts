// @/api/services/accounts/index.ts
import axiosInstance from "@/api/api";
import { routes } from "@/api/services/account/routes";
import type { Account, ToggleAccountStatusRequest } from "./types";

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
    toggleStatus: async (accountId: number, isEnabled: boolean): Promise<void> => {
        await axiosInstance.patch(
            routes.toggleStatus(accountId),
            { isEnabled } as ToggleAccountStatusRequest
        );
    },
};
