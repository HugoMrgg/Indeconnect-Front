import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/api/errors";
import {EthicsFormDto, EthicsQuestionDto} from "@/api/services/ethics/superVendor/types";

// ✅ utilise TES types déjà existants (adapter le chemin si besoin)


// ✅ utilise TON service déjà codé (adapter le chemin si besoin)
import { EthicsSuperVendorQuestionnaireService } from "@/api/services/ethics/superVendor";

/** DTO de requête attendu par ton back (d’après ton code) */
type UpsertQuestionnaireRequest = {
    submit: boolean;
    answers: QuestionAnswerDto[];
};

type QuestionAnswerDto = {
    questionId: number;
    optionIds: number[];
};

const isLockedStatus = (s?: string) => s === "Approved" || s === "Rejected";

export function useMyEthicsQuestionnaire(open: boolean) {
    const [form, setForm] = useState<EthicsFormDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // pour éviter doubles fetch/overwrite
    const fetchedOnceRef = useRef(false);

    const status = form?.status ?? "Draft";
    const locked = isLockedStatus(status);

    const fetchForm = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await EthicsSuperVendorQuestionnaireService.getMyForm();
            setForm(data);
            fetchedOnceRef.current = true;
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors du chargement du questionnaire.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch uniquement quand modal ouverte
    useEffect(() => {
        if (!open) return;

        // si tu veux recharger à chaque ouverture, supprime ce if
        if (fetchedOnceRef.current) return;

        fetchForm();
    }, [open, fetchForm]);

    // Helpers: flat list of questions
    const allQuestions = useMemo(() => {
        if (!form) return [];
        return form.categories.flatMap((c) => c.questions);
    }, [form]);

    const progress = useMemo(() => {
        if (!form) return { done: 0, total: 0 };

        let total = 0;
        let done = 0;

        for (const c of form.categories) {
            for (const q of c.questions) {
                total += 1;
                const selected = q.selectedOptionIds ?? [];
                const t = (q.answerType ?? "Single").toLowerCase();

                if (t === "single") {
                    if (selected.length === 1) done += 1;
                } else if (t === "multiple") {
                    if (selected.length >= 1) done += 1;
                } else {
                    // fallback : considère "Single"
                    if (selected.length === 1) done += 1;
                }
            }
        }

        return { done, total };
    }, [form]);

    const isComplete = useMemo(() => {
        return progress.total > 0 && progress.done === progress.total;
    }, [progress]);

    /** Met à jour le state local (sans appel API) */
    const pickAnswer = useCallback(
        (question: EthicsQuestionDto, optionId: number) => {
            if (!form) return;
            if (locked) return;

            setForm((prev) => {
                if (!prev) return prev;

                const nextCategories = prev.categories.map((cat) => {
                    const nextQuestions = cat.questions.map((q) => {
                        if (q.id !== question.id) return q;

                        const answerType = (q.answerType ?? "Single").toLowerCase();
                        const current = q.selectedOptionIds ? [...q.selectedOptionIds] : [];

                        let nextSelected: number[];

                        if (answerType === "multiple") {
                            // toggle
                            nextSelected = current.includes(optionId)
                                ? current.filter((id) => id !== optionId)
                                : [...current, optionId];
                        } else {
                            // single
                            nextSelected = [optionId];
                        }

                        return { ...q, selectedOptionIds: nextSelected };
                    });

                    return { ...cat, questions: nextQuestions };
                });

                return { ...prev, categories: nextCategories };
            });
        },
        [form, locked]
    );

    /** Reset local (tu peux aussi choisir de re-fetch pour revenir à l’état serveur) */
    const reset = useCallback(() => {
        if (!form) return;
        if (locked) return;

        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                categories: prev.categories.map((c) => ({
                    ...c,
                    questions: c.questions.map((q) => ({ ...q, selectedOptionIds: [] })),
                })),
            };
        });
    }, [form, locked]);

    /** Construit le payload attendu par le back */
    const buildRequest = useCallback(
        (submit: boolean): UpsertQuestionnaireRequest => {
            const answers: QuestionAnswerDto[] = allQuestions.map((q) => ({
                questionId: Number(q.id),
                optionIds: (q.selectedOptionIds ?? []).map((x) => Number(x)),
            }));

            return { submit, answers };
        },
        [allQuestions]
    );

    /** Save draft (optionnel, mais souvent utile) */
    const saveDraft = useCallback(async () => {
        if (!form) return false;
        if (locked) return false;

        setSaving(true);
        setError(null);
        try {
            const req = buildRequest(false);
            const updated = await EthicsSuperVendorQuestionnaireService.upsertMyForm(req);
            setForm(updated);
            return true;
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors de l'enregistrement.");
            return false;
        } finally {
            setSaving(false);
        }
    }, [form, locked, buildRequest]);

    /** Submit (envoie + back calcule les scores) */
    const submit = useCallback(async () => {
        if (!form) return false;
        if (locked) {
            setError("Questionnaire clôturé : impossible de soumettre à nouveau.");
            return false;
        }
        if (!isComplete) {
            setError("Tu dois répondre à toutes les questions avant de soumettre.");
            return false;
        }

        setSaving(true);
        setError(null);
        try {
            const req = buildRequest(true);
            const updated = await EthicsSuperVendorQuestionnaireService.upsertMyForm(req);
            setForm(updated);
            return true;
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors de l'envoi du questionnaire.");
            return false;
        } finally {
            setSaving(false);
        }
    }, [form, locked, isComplete, buildRequest]);

    return {
        form,
        setForm,

        loading,
        saving,
        error,

        status,
        locked,

        progress,
        isComplete,

        refetch: fetchForm,
        pickAnswer,
        reset,

        saveDraft, // ✅ pratique si tu veux autosave
        submit,    // ✅ utilisé par ton modal
    };
}
