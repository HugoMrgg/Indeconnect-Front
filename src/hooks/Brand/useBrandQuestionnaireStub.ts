import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {EthicsCategory, EthicsQuestionDTO, stubEthicsQuestions} from "@/features/brands/ethics/stubEthicsData";


export type BrandQuestionResponseDTO = {
    questionId: number;
    optionId: number;
};

export type BrandQuestionnaireDTO = {
    id: number;
    brandId: number;
    submittedAt: string | null;
    isApproved: boolean;
    approvedAt: string | null;
    responses: BrandQuestionResponseDTO[];
};

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const mkKey = (brandId: number) => `brand:${brandId}:questionnaireStub`;

function nowIso() {
    return new Date().toISOString();
}

function safeParse<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function toAnswersMap(responses: BrandQuestionResponseDTO[]) {
    const map: Record<number, number> = {};
    for (const r of responses) map[r.questionId] = r.optionId;
    return map;
}

function toResponsesArray(answers: Record<number, number>) {
    return Object.entries(answers).map(([qid, oid]) => ({
        questionId: Number(qid),
        optionId: Number(oid),
    }));
}

/**
 * Convertit les scores "bruts" (option.score) en étoiles 0..5.
 * Normalisation = somme(selected) / somme(maxPossible) * 5
 */
function computeStarsForCategory(
    questions: EthicsQuestionDTO[],
    answers: Record<number, number>,
    category: EthicsCategory
) {
    const qs = questions.filter(q => q.category === category);

    const maxPossible = qs.reduce((acc, q) => {
        const maxOpt = Math.max(...q.options.map((o: { score: any; }) => o.score));
        return acc + maxOpt;
    }, 0);

    const selectedSum = qs.reduce((acc, q) => {
        const chosenOptId = answers[q.id];
        if (!chosenOptId) return acc;
        const opt = q.options.find((o: { id: number; }) => o.id === chosenOptId);
        return acc + (opt?.score ?? 0);
    }, 0);

    if (maxPossible <= 0) return 0;

    return round1(clamp((selectedSum / maxPossible) * 5, 0, 5));
}

function computeOverallStars(questions: EthicsQuestionDTO[], answers: Record<number, number>) {
    const t = computeStarsForCategory(questions, answers, EthicsCategory.Transport);
    const p = computeStarsForCategory(questions, answers, EthicsCategory.MaterialsManufacturing);
    return round1((t + p) / 2);
}

/*
export function useBrandQuestionnaireStub(brandId: number) {
    const questions = useMemo(() => {
        // on garde l'ordre stable comme côté admin
        const copy = [...stubEthicsQuestions];
        copy.sort((a, b) => {
            if (a.category !== b.category) return a.category.localeCompare(b.category);
            return a.order - b.order;
        });
        return copy;
    }, []);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [questionnaire, setQuestionnaire] = useState<BrandQuestionnaireDTO>(() => {
        const key = mkKey(brandId);
        const existing = safeParse<BrandQuestionnaireDTO>(localStorage.getItem(key));
        if (existing && existing.brandId === brandId) return existing;

        // questionnaire "vide"
        return {
            id: Date.now(), // stub id
            brandId,
            submittedAt: null,
            isApproved: false,
            approvedAt: null,
            responses: [],
        };
    });

    const [answers, setAnswers] = useState<Record<number, number>>(() =>
        toAnswersMap(questionnaire.responses)
    );

    // ✅ auto-save draft (debounce)
    const saveTimer = useRef<number | null>(null);

    const persist = (qcm: BrandQuestionnaireDTO) => {
        try {
            localStorage.setItem(mkKey(brandId), JSON.stringify(qcm));
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        // simule un chargement
        setLoading(true);
        setError(null);

        const key = mkKey(brandId);
        const existing = safeParse<BrandQuestionnaireDTO>(localStorage.getItem(key));

        if (existing && existing.brandId === brandId) {
            setQuestionnaire(existing);
            setAnswers(toAnswersMap(existing.responses));
        } else {
            const fresh: BrandQuestionnaireDTO = {
                id: Date.now(),
                brandId,
                submittedAt: null,
                isApproved: false,
                approvedAt: null,
                responses: [],
            };
            setQuestionnaire(fresh);
            setAnswers({});
            persist(fresh);
        }

        const t = window.setTimeout(() => setLoading(false), 120);
        return () => window.clearTimeout(t);
    }, [brandId, persist]);

    // persiste les changements d'answers -> questionnaire.responses
    useEffect(() => {
        // on rebuild responses
        const updated: BrandQuestionnaireDTO = {
            ...questionnaire,
            responses: toResponsesArray(answers),
        };
        setQuestionnaire(updated);

        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => {
            persist(updated);
        }, 250);

        return () => {
            if (saveTimer.current) window.clearTimeout(saveTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers]);

    const setAnswer = (questionId: number, optionId: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const isComplete = useMemo(() => {
        return questions.every(q => !!answers[q.id]);
    }, [questions, answers]);

    const isFilled = useMemo(() => {
        return Object.keys(answers).length > 0;
    }, [answers]);

    const scores = useMemo(() => {
        const transport = computeStarsForCategory(questions, answers, EthicsCategory.Transport);
        const production = computeStarsForCategory(questions, answers, EthicsCategory.MaterialsManufacturing);
        const overall = computeOverallStars(questions, answers);
        return {
            transport,
            production,
            overall,
            // affichage FR avec virgule si tu veux :
            transportLabel: transport.toFixed(1).replace(".", ","),
            productionLabel: production.toFixed(1).replace(".", ","),
            overallLabel: overall.toFixed(1).replace(".", ","),
        };
    }, [questions, answers]);

    const submit = async () => {
        setError(null);

        if (!isComplete) {
            setError("Merci de répondre à toutes les questions avant de soumettre.");
            return false;
        }

        const updated: BrandQuestionnaireDTO = {
            ...questionnaire,
            submittedAt: nowIso(),
            isApproved: false,
            approvedAt: null,
            responses: toResponsesArray(answers),
        };

        setQuestionnaire(updated);
        persist(updated);
        return true;
    };

    // helper DEV : simuler validation modérateur
    const approve = async () => {
        const updated: BrandQuestionnaireDTO = {
            ...questionnaire,
            isApproved: true,
            approvedAt: nowIso(),
            // on laisse submittedAt tel quel (ou on le set si nul)
            submittedAt: questionnaire.submittedAt ?? nowIso(),
        };
        setQuestionnaire(updated);
        persist(updated);
        return true;
    };

    const reset = () => {
        const fresh: BrandQuestionnaireDTO = {
            id: Date.now(),
            brandId,
            submittedAt: null,
            isApproved: false,
            approvedAt: null,
            responses: [],
        };
        setQuestionnaire(fresh);
        setAnswers({});
        persist(fresh);
    };

    return {
        loading,
        error,

        questions,
        questionnaire,

        answers,
        setAnswer,

        isFilled,
        isComplete,

        scores, // ⭐ 0..5 avec 1 décimale + labels virgule

        submit,
        approve, // optionnel
        reset,
    };
}
*/
export function useBrandQuestionnaireStub(brandId: number) {
    // 1. Questions stables
    const questions = useMemo(() => {
        const copy = [...stubEthicsQuestions];
        copy.sort((a, b) => {
            if (a.category !== b.category) return a.category.localeCompare(b.category);
            return a.order - b.order;
        });
        return copy;
    }, []);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Initialisation Lazy du state (ne s'exécute qu'une fois au montage)
    const [questionnaire, setQuestionnaire] = useState<BrandQuestionnaireDTO>(() => {
        if (!brandId) return {} as any; // Securité
        const key = mkKey(brandId);
        const existing = safeParse<BrandQuestionnaireDTO>(localStorage.getItem(key));
        if (existing && existing.brandId === brandId) return existing;

        return {
            id: Date.now(),
            brandId,
            submittedAt: null,
            isApproved: false,
            approvedAt: null,
            responses: [],
        };
    });

    const [answers, setAnswers] = useState<Record<number, number>>(() =>
        questionnaire.responses ? toAnswersMap(questionnaire.responses) : {}
    );

    // ✅ FIX 1: Utilisation de useCallback pour que la fonction ne change pas à chaque render
    const persist = useCallback((qcm: BrandQuestionnaireDTO) => {
        try {
            localStorage.setItem(mkKey(brandId), JSON.stringify(qcm));
        } catch (e) {
            console.error("Storage error", e);
        }
    }, [brandId]);

    // ✅ FIX 2: useEffect de chargement propre
    // Il ne dépend QUE de brandId. Il met à jour le state si l'ID change.
    useEffect(() => {
        setLoading(true);
        setError(null);

        const t = window.setTimeout(() => {
            const key = mkKey(brandId);
            const existing = safeParse<BrandQuestionnaireDTO>(localStorage.getItem(key));

            if (existing && existing.brandId === brandId) {
                setQuestionnaire(existing);
                setAnswers(toAnswersMap(existing.responses));
            } else {
                // Reset si changement de marque et rien en stockage
                const fresh: BrandQuestionnaireDTO = {
                    id: Date.now(),
                    brandId,
                    submittedAt: null,
                    isApproved: false,
                    approvedAt: null,
                    responses: [],
                };
                setQuestionnaire(fresh);
                setAnswers({});
                // On ne persiste pas tout de suite pour éviter effets de bord, sauf si nécessaire
            }
            setLoading(false);
        }, 300); // Petit délai pour simuler réseau

        return () => window.clearTimeout(t);
    }, [brandId]); // ⚠️ Plus de 'persist' ici

    // 3. Gestionnaire de sauvegarde automatique (Debounce)
    const saveTimer = useRef<number | null>(null);

    useEffect(() => {
        // On ne déclenche la sauvegarde que si on a des réponses ou si le questionnaire existe
        if (!questionnaire || loading) return;

        const updated: BrandQuestionnaireDTO = {
            ...questionnaire,
            responses: toResponsesArray(answers),
        };

        // Mise à jour locale (ne déclenche pas le useEffect[brandId] du haut)
        setQuestionnaire(updated);

        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => {
            persist(updated);
        }, 500);

        return () => {
            if (saveTimer.current) window.clearTimeout(saveTimer.current);
        };
    }, [answers, persist]); // Ici persist est stable grâce au useCallback, donc pas de boucle.

    // --- ACTIONS ---

    const setAnswer = useCallback((questionId: number, optionId: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    }, []);

    const reset = useCallback(() => {
        const fresh: BrandQuestionnaireDTO = {
            id: Date.now(),
            brandId,
            submittedAt: null,
            isApproved: false,
            approvedAt: null,
            responses: [],
        };
        setQuestionnaire(fresh);
        setAnswers({});
        persist(fresh);
    }, [brandId, persist]);

    const submit = useCallback(async () => {
        // Recalculer isComplete ici pour être sûr (éviter dépendances circulaires)
        const isComp = questions.every((q) => !!answers[q.id]);

        if (!isComp) {
            setError("Merci de répondre à toutes les questions avant de soumettre.");
            return false;
        }

        const updated: BrandQuestionnaireDTO = {
            ...questionnaire,
            submittedAt: nowIso(),
            responses: toResponsesArray(answers),
        };

        setQuestionnaire(updated);
        persist(updated);
        setError(null);
        return true;
    }, [answers, questionnaire, persist, questions]);

    const approve = useCallback(async () => {
        const updated: BrandQuestionnaireDTO = {
            ...questionnaire,
            isApproved: true,
            approvedAt: nowIso(),
            submittedAt: questionnaire.submittedAt ?? nowIso(),
        };
        setQuestionnaire(updated);
        persist(updated);
        return true;
    }, [questionnaire, persist]);

    // --- CALCULS MEMOISÉS ---

    const isFilled = useMemo(() => Object.keys(answers).length > 0, [answers]);

    const isComplete = useMemo(() => {
        return questions.every((q) => !!answers[q.id]);
    }, [questions, answers]);

    const scores = useMemo(() => {
        const transport = computeStarsForCategory(questions, answers, EthicsCategory.Transport);
        const production = computeStarsForCategory(questions, answers, EthicsCategory.MaterialsManufacturing);
        const overall = computeOverallStars(questions, answers);
        return {
            transport,
            production,
            overall,
            transportLabel: transport.toFixed(1).replace(".", ","),
            productionLabel: production.toFixed(1).replace(".", ","),
            overallLabel: overall.toFixed(1).replace(".", ","),
        };
    }, [questions, answers]);

    // ✅ FIX 3: Le return final est memoïsé
    // Cela empêche le composant parent (la Modal) de re-render en boucle
    return useMemo(() => ({
        loading,
        error,
        questions,
        questionnaire,
        answers,
        setAnswer,
        isFilled,
        isComplete,
        scores,
        submit,
        approve,
        reset,
    }), [
        loading,
        error,
        questions,
        questionnaire,
        answers,
        setAnswer,
        isFilled,
        isComplete,
        scores,
        submit,
        approve,
        reset
    ]);
}