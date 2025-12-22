import { useCallback, useEffect, useState } from "react";
import {PaymentMethodDto} from "@/api/services/payments-methods/types";
import {paymentMethodsService} from "@/api/services/payments-methods";

type State = {
    data: PaymentMethodDto[];
    isLoading: boolean;
    actingId: string | null;
    error: string | null;
};

export function usePaymentMethods() {
    const [state, setState] = useState<State>({
        data: [],
        isLoading: true,
        actingId: null,
        error: null,
    });

    const fetchMine = useCallback(async () => {
        setState((p) => ({ ...p, isLoading: true, error: null }));
        try {
            const data = await paymentMethodsService.getMine();
            setState((p) => ({ ...p, data, isLoading: false }));
        } catch (e: any) {
            setState((p) => ({ ...p, isLoading: false, error: e?.message ?? "Erreur de chargement" }));
        }
    }, []);

    useEffect(() => {
        fetchMine();
    }, [fetchMine]);

    const removePaymentMethod = useCallback(
        async (id: string) => {
            const previous = state.data;

            // Optimistic
            setState((p) => ({
                ...p,
                actingId: id,
                error: null,
                data: p.data.filter((m) => m.id !== id),
            }));

            try {
                await paymentMethodsService.remove(id);
                setState((p) => ({ ...p, actingId: null }));
            } catch (e: any) {
                // rollback
                setState((p) => ({
                    ...p,
                    data: previous,
                    actingId: null,
                    error: e?.message ?? "Erreur lors de la suppression",
                }));
            }
        },
        [state.data]
    );

    const setDefaultMethod = useCallback(
        async (id: string) => {
            const previous = state.data;

            // Optimistic
            setState((p) => ({
                ...p,
                actingId: id,
                error: null,
                data: p.data.map((m) => ({ ...m, isDefault: m.id === id })),
            }));

            try {
                await paymentMethodsService.setDefault(id);
                setState((p) => ({ ...p, actingId: null }));
            } catch (e: any) {
                // rollback
                setState((p) => ({
                    ...p,
                    data: previous,
                    actingId: null,
                    error: e?.message ?? "Impossible de définir par défaut",
                }));
            }
        },
        [state.data]
    );

    return {
        ...state,
        refetch: fetchMine,
        removePaymentMethod,
        setDefaultMethod,
    };
}
