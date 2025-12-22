import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/api/errors";
import { EthicsAdminCatalogService } from "@/api/services/ethics/admin";
import type {
    AdminCatalogDto,
    AdminQuestionDto,
    AdminOptionDto,
    AdminUpsertCatalogRequest,
    UpsertQuestionDto,
    UpsertOptionDto,
} from "@/api/services/ethics/admin/types";

type QuestionVM = AdminQuestionDto & { clientId: string };
type OptionVM = AdminOptionDto & { clientId: string };

const cid = () => crypto.randomUUID();

const isNew = (id: number) => !id || id <= 0;

export function useEthicsAdminCatalog(open: boolean) {
    const [catalog, setCatalog] = useState<AdminCatalogDto | null>(null);
    const [questions, setQuestions] = useState<QuestionVM[]>([]);
    const [options, setOptions] = useState<OptionVM[]>([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const baselineRef = useRef<string>("");

    const hydrate = useCallback((dto: AdminCatalogDto) => {
        setCatalog(dto);
        setQuestions(dto.questions.map(q => ({ ...q, clientId: cid() })));
        setOptions(dto.options.map(o => ({ ...o, clientId: cid() })));

        // baseline pour dirty check
        baselineRef.current = JSON.stringify({
            q: dto.questions,
            o: dto.options,
        });
    }, []);

    const fetchCatalog = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const dto = await EthicsAdminCatalogService.getCatalog();
            hydrate(dto);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors du chargement du catalogue.");
        } finally {
            setLoading(false);
        }
    }, [hydrate]);

    useEffect(() => {
        if (!open) return;
        void fetchCatalog();
    }, [open, fetchCatalog]);

    const dirty = useMemo(() => {
        if (!catalog) return false;
        const now = JSON.stringify({
            q: questions.map(({ clientId: _clientId, ...rest }) => rest),
            o: options.map(({ clientId: _clientId, ...rest }) => rest),
        });
        return now !== baselineRef.current;
    }, [catalog, questions, options]);


    // -------- actions Questions --------
    const addQuestion = useCallback((categoryKey: string) => {
        setQuestions(prev => [
            ...prev,
            {
                id: 0,
                categoryId: 0,
                categoryKey,
                key: "",
                label: "",
                order: (prev.filter(x => x.categoryKey === categoryKey).length + 1) * 10,
                answerType: "Single",
                isActive: true,
                clientId: cid(),
            },
        ]);
    }, []);

    const updateQuestion = useCallback((clientId: string, patch: Partial<QuestionVM>) => {
        setQuestions(prev => prev.map(q => (q.clientId === clientId ? { ...q, ...patch } : q)));
    }, []);

    const toggleQuestionActive = useCallback((clientId: string) => {
        setQuestions(prev => prev.map(q => (q.clientId === clientId ? { ...q, isActive: !q.isActive } : q)));
    }, []);

    // -------- actions Options --------
    const addOption = useCallback((questionKey: string) => {
        setOptions(prev => [
            ...prev,
            {
                id: 0,
                questionId: 0,
                questionKey,
                key: "",
                label: "",
                order: (prev.filter(x => x.questionKey === questionKey).length + 1) * 10,
                score: 0,
                isActive: true,
                clientId: cid(),
            },
        ]);
    }, []);

    const updateOption = useCallback((clientId: string, patch: Partial<OptionVM>) => {
        setOptions(prev => prev.map(o => (o.clientId === clientId ? { ...o, ...patch } : o)));
    }, []);

    const toggleOptionActive = useCallback((clientId: string) => {
        setOptions(prev => prev.map(o => (o.clientId === clientId ? { ...o, isActive: !o.isActive } : o)));
    }, []);

    // -------- save --------
    const buildPayload = useCallback((): AdminUpsertCatalogRequest => {
        const qPayload: UpsertQuestionDto[] = questions.map(q => ({
            id: isNew(q.id) ? null : q.id,
            categoryKey: q.categoryKey,
            key: q.key.trim(),
            label: q.label.trim(),
            order: Number(q.order ?? 0),
            answerType: q.answerType,
            isActive: q.isActive,
        }));

        const oPayload: UpsertOptionDto[] = options.map(o => ({
            id: isNew(o.id) ? null : o.id,
            questionKey: o.questionKey.trim(),
            key: o.key.trim(),
            label: o.label.trim(),
            order: Number(o.order ?? 0),
            score: Number(o.score ?? 0),
            isActive: o.isActive,
        }));

        return {
            categories: [
                {id: 1, key: "Manufacture", label: "Manufacture", order: 1, isActive: true},
                {id: 2, key: "Transport", label: "Transport", order: 2, isActive: true},
            ],
            questions: qPayload,
            options: oPayload,
        };
    }, [questions, options]);


        const save = useCallback(async () => {
        if (!catalog) return false;

        // mini validation front (évite les 500)
        const missingQ = questions.find(q => !q.key.trim() || !q.label.trim() || !q.categoryKey.trim());
        if (missingQ) {
            setError("Certaines questions n’ont pas de Key/Label/Category.");
            return false;
        }
        const missingO = options.find(o => !o.key.trim() || !o.label.trim() || !o.questionKey.trim());
        if (missingO) {
            setError("Certaines options n’ont pas de Key/Label/QuestionKey.");
            return false;
        }

        setSaving(true);
        setError(null);
        try {
            const updated = await EthicsAdminCatalogService.upsertCatalog(buildPayload());
            hydrate(updated); // refresh ids + baseline
            return true;
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors de l’enregistrement.");
            return false;
        } finally {
            setSaving(false);
        }
    }, [catalog, questions, options, buildPayload, hydrate]);

    const reset = useCallback(() => {
        if (!catalog) return;
        hydrate(catalog);
    }, [catalog, hydrate]);

    // -------- grouping --------
    const categories = catalog?.categories ?? [];

    const questionsByCategory = useMemo(() => {
        const map = new Map<string, QuestionVM[]>();
        for (const q of questions) {
            if (!map.has(q.categoryKey)) map.set(q.categoryKey, []);
            map.get(q.categoryKey)!.push(q);
        }
        for (const [, arr] of map) arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return map;
    }, [questions]);

    const optionsByQuestionKey = useMemo(() => {
        const map = new Map<string, OptionVM[]>();
        for (const o of options) {
            if (!map.has(o.questionKey)) map.set(o.questionKey, []);
            map.get(o.questionKey)!.push(o);
        }
        for (const [, arr] of map) arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return map;
    }, [options]);

    return {
        catalog,
        categories,

        questions,
        options,

        questionsByCategory,
        optionsByQuestionKey,

        loading,
        saving,
        error,

        dirty,

        refetch: fetchCatalog,
        reset,
        save,

        addQuestion,
        updateQuestion,
        toggleQuestionActive,

        addOption,
        updateOption,
        toggleOptionActive,
    };
}
