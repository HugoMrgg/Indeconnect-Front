import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/api/errors";
import {EthicsFormDto, UpsertQuestionnaireRequest} from "@/api/services/ethics/superVendor/types";
import {EthicsSuperVendorQuestionnaireService} from "@/api/services/ethics/superVendor";

const normalizeAnswerType = (v: any): "Single" | "Multiple" => (v === "Multiple" ? "Multiple" : "Single");

export function useSuperVendorEthicsQuestionnaire() {
    const [form, setForm] = useState<EthicsFormDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const readOnly = useMemo(() => {
        const s = form?.status;
        return s === "Approved" || s === "Rejected";
    }, [form?.status]);

    const fetchForm = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await EthicsSuperVendorQuestionnaireService.getMyForm();
            // sécurise answerType
            const safe: EthicsFormDto = {
                ...data,
                categories: data.categories.map(c => ({
                    ...c,
                    questions: c.questions.map(q => ({
                        ...q,
                        answerType: normalizeAnswerType(q.answerType),
                        selectedOptionIds: q.selectedOptionIds ?? [],
                    })),
                })),
            };
            setForm(safe);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors du chargement du questionnaire.");
        } finally {
            setLoading(false);
        }
    }, []);

    const save = useCallback(async (submit: boolean) => {
        if (!form) return false;
        setSaving(true);
        setError(null);
        try {
            const payload: UpsertQuestionnaireRequest = {
                submit,
                answers: form.categories.flatMap(c =>
                    c.questions.map(q => ({
                        questionId: q.id,
                        optionIds: q.selectedOptionIds ?? [],
                    }))
                ),
            };

            const updated = await EthicsSuperVendorQuestionnaireService.upsertMyForm(payload);
            setForm(updated);
            return true;
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors de l'enregistrement.");
            return false;
        } finally {
            setSaving(false);
        }
    }, [form]);

    useEffect(() => { fetchForm(); }, [fetchForm]);

    return { form, setForm, loading, saving, error, refetch: fetchForm, saveDraft: () => save(false), submit: () => save(true), readOnly };
}
