import React, { useMemo, useState } from "react";
import {
    X,
    Loader2,
    Save,
    Send,
    RotateCcw,
    Search,
    CheckCircle2,
    Lock,
    RefreshCcw,
} from "lucide-react";


import type { EthicsQuestionDto } from "@/api/services/ethics/superVendor/types";
import {useMyEthicsQuestionnaire} from "@/hooks/SuperVendor/useMyEthicsQuestionnaire";

type Props = {
    open: boolean;
    onClose: () => void;
    searchQuery?: string;
    onSubmitted?: () => void;
};

const isMultiple = (t?: string) => (t ?? "Single").toLowerCase() === "multiple";

export const BrandEthicsQuestionnaireModal: React.FC<Props> = ({
                                                                   open,
                                                                   onClose,
                                                                   searchQuery,
                                                                   onSubmitted,
                                                               }) => {
    const {
        form,
        loading,
        saving,
        error,
        status,
        locked,
        progress,
        isComplete,
        refetch,
        pickAnswer,
        reset,
        saveDraft,
        submit,
    } = useMyEthicsQuestionnaire(open);

    const [localSearch, setLocalSearch] = useState("");
    const q = (searchQuery ?? localSearch).trim().toLowerCase();

    const filteredCategories = useMemo(() => {
        if (!form) return [];
        if (!q) return form.categories ?? [];

        return (form.categories ?? [])
            .map((cat: any) => {
                const catKey = String(cat.key ?? "");
                const catLabel = String(cat.label ?? catKey);

                const catMatch =
                    catKey.toLowerCase().includes(q) || catLabel.toLowerCase().includes(q);

                const questions = (cat.questions ?? [])
                    .map((qu: EthicsQuestionDto) => {
                        const qMatch =
                            (qu.key ?? "").toLowerCase().includes(q) ||
                            (qu.label ?? "").toLowerCase().includes(q);

                        const opts = (qu.options ?? []).filter((o: any) => {
                            const ok = (o.key ?? "").toLowerCase().includes(q);
                            const ol = (o.label ?? "").toLowerCase().includes(q);
                            return ok || ol;
                        });

                        if (qMatch) return qu;
                        if (opts.length) return { ...qu, options: opts };
                        return null;
                    })
                    .filter(Boolean);

                if (catMatch) return cat;
                if (questions.length) return { ...cat, questions };
                return null;
            })
            .filter(Boolean) as any[];
    }, [form, q]);

    const statusBadge = useMemo(() => {
        const s = (status ?? "Draft").toLowerCase();
        const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs border";
        if (s === "approved") return `${base} bg-green-50 text-green-700 border-green-200`;
        if (s === "rejected") return `${base} bg-red-50 text-red-700 border-red-200`;
        if (s === "submitted" || s === "pending") return `${base} bg-blue-50 text-blue-700 border-blue-200`;
        return `${base} bg-gray-50 text-gray-700 border-gray-200`;
    }, [status]);

    const handleSaveDraft = async () => {
        const ok = await saveDraft();
        if (ok) await refetch();
    };

    const handleSubmit = async () => {
        const ok = await submit();
        if (ok) {
            await refetch();
            onSubmitted?.();
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90]">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={saving ? undefined : onClose}
                aria-hidden="true"
            />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <div className="text-lg font-semibold text-gray-900">
                                    Questionnaire éthique
                                </div>

                                <span className={statusBadge}>{status ?? "Draft"}</span>

                                {locked ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                    <Lock size={14} /> verrouillé
                  </span>
                                ) : null}
                            </div>

                            <div className="mt-1 text-sm text-gray-600">
                                {locked
                                    ? "Lecture seule : questionnaire clôturé."
                                    : "Réponds aux questions, enregistre en brouillon, puis soumets."}
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="text-xs text-gray-600">
                                    Progression: <span className="font-semibold">{progress.done}</span> /{" "}
                                    <span className="font-semibold">{progress.total}</span>
                                </div>

                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                    <div
                                        className="h-full bg-gray-900"
                                        style={{
                                            width:
                                                progress.total > 0
                                                    ? `${Math.round((progress.done / progress.total) * 100)}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>

                                {isComplete ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-green-700">
                    <CheckCircle2 size={14} /> complet
                  </span>
                                ) : (
                                    <span className="text-xs text-gray-500">incomplet</span>
                                )}
                            </div>

                            {error ? (
                                <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                                    {error}
                                </div>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50"
                            aria-label="Fermer"
                            title="Fermer"
                        >
                            <X />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="max-h-[70vh] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 flex items-center justify-center gap-3 text-gray-600">
                                <Loader2 className="animate-spin" /> Chargement…
                            </div>
                        ) : !form ? (
                            <div className="p-8 space-y-4">
                                <div className="text-gray-800 font-semibold">
                                    Impossible de charger le questionnaire.
                                </div>

                                <button
                                    type="button"
                                    onClick={refetch}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                                >
                                    <RefreshCcw size={16} /> Réessayer
                                </button>
                            </div>
                        ) : (
                            <div className="p-5 space-y-5">
                                {searchQuery == null ? (
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-full max-w-sm">
                                            <Search
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                value={localSearch}
                                                onChange={(e) => setLocalSearch(e.target.value)}
                                                placeholder="Rechercher question/option…"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10"
                                            />
                                        </div>
                                    </div>
                                ) : null}

                                {filteredCategories.length === 0 ? (
                                    <div className="text-sm text-gray-600 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4">
                                        Rien ne correspond à ta recherche.
                                    </div>
                                ) : null}

                                {filteredCategories.map((cat: any) => {
                                    const catKey = String(cat.key ?? "");
                                    const catLabel = String(cat.label ?? catKey);

                                    return (
                                        <section
                                            key={catKey || catLabel}
                                            className="border border-gray-200 rounded-2xl overflow-hidden"
                                        >
                                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                                <div className="font-semibold text-gray-900">{catLabel}</div>
                                                <div className="text-xs text-gray-500">
                                                    {(cat.questions ?? []).length} question(s)
                                                </div>
                                            </div>

                                            <div className="p-4 space-y-4">
                                                {(cat.questions ?? []).map((qu: EthicsQuestionDto) => {
                                                    const multi = isMultiple(qu.answerType);
                                                    const selected = qu.selectedOptionIds ?? [];

                                                    return (
                                                        <div key={qu.id} className="border border-gray-200 rounded-2xl p-4">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-semibold text-gray-900">
                                                                        {qu.label}
                                                                    </div>
                                                                    <div className="mt-1 text-xs text-gray-500">
                                                                        {qu.key} • {multi ? "Choix multiples" : "Choix unique"}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 space-y-2">
                                                                {(qu.options ?? []).map((opt: any) => {
                                                                    const active = selected.includes(opt.id);
                                                                    const disabled = locked || saving;

                                                                    return (
                                                                        <label
                                                                            key={opt.id}
                                                                            className={[
                                                                                "flex items-center gap-3 p-3 rounded-xl border transition",
                                                                                active
                                                                                    ? "border-gray-900 bg-gray-50"
                                                                                    : "border-gray-200 hover:bg-gray-50",
                                                                                disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                                                                            ].join(" ")}
                                                                        >
                                                                            <input
                                                                                type={multi ? "checkbox" : "radio"}
                                                                                name={`q_${qu.id}`}
                                                                                checked={active}
                                                                                disabled={disabled}
                                                                                onChange={() => pickAnswer(qu, opt.id)}
                                                                                className="h-4 w-4"
                                                                            />
                                                                            <div className="min-w-0">
                                                                                <div className="text-sm text-gray-900">{opt.label}</div>
                                                                                <div className="text-xs text-gray-500">{opt.key}</div>
                                                                            </div>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-xs text-gray-500">
                            {locked
                                ? "Questionnaire clôturé."
                                : "Enregistre en brouillon quand tu veux. Soumets quand tout est complet."}
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                            <button
                                type="button"
                                onClick={reset}
                                disabled={locked || saving || loading || !form}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <RotateCcw size={16} /> Reset
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={locked || saving || loading || !form}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                                title="Sauvegarder en brouillon"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Enregistrer
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={locked || saving || loading || !form || !isComplete}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                                title={!isComplete ? "Réponds à tout avant de soumettre" : "Soumettre"}
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Soumettre
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
