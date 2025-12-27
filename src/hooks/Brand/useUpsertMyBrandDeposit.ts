import { useState, useCallback } from "react";
import { brandsService } from "@/api/services/brands";
import {
    DepositDTO,
    UpsertBrandDepositRequest,
} from "@/api/services/brands/types";

interface UseUpsertMyBrandDepositResult {
    saving: boolean;
    error: string | null;
    upsertDeposit: (data: UpsertBrandDepositRequest) => Promise<DepositDTO | null>;
}

export function useUpsertMyBrandDeposit(): UseUpsertMyBrandDepositResult {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upsertDeposit = useCallback(
        async (data: UpsertBrandDepositRequest) => {
            setSaving(true);
            setError(null);
            try {
                const result = await brandsService.upsertMyBrandDeposit(data);
                return result;
            } catch (e) {
                console.error("Erreur dépôt", e);

                if (e instanceof Error) {
                    setError(e.message);
                } else if (typeof e === "string") {
                    setError(e);
                } else {
                    setError("Erreur lors de l'enregistrement du dépôt.");
                }

                return null;
            } finally {
                setSaving(false);
            }
        },
        []
    );

    return { saving, error, upsertDeposit };
}
