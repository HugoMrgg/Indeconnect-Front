import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/api/errors";
import { EthicsSuperVendorQuestionnaireService } from "@/api/services/ethics/superVendor";

export type QuestionnaireStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | string;

export function useEthicsStatus(enabled: boolean = true) {
    const [status, setStatus] = useState<QuestionnaireStatus>("Draft");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        setError(null);
        try {
            const form = await EthicsSuperVendorQuestionnaireService.getMyForm();
            setStatus(form.status as QuestionnaireStatus);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Impossible de récupérer le statut éthique.");
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;
        refetch();
    }, [enabled, refetch]);

    // écoute l’event global déclenché après save/submit
    useEffect(() => {
        if (!enabled) return;
        const handler = () => refetch();
        window.addEventListener("ethics:updated", handler);
        return () => window.removeEventListener("ethics:updated", handler);
    }, [enabled, refetch]);

    const needsAttention = useMemo(() => status !== "Approved", [status]);

    return { status, needsAttention, loading, error, refetch };
}
