import React, { useMemo, useState } from "react";
import {
    X,
    Loader2,
    Save,
    Send,
    RotateCcw,
    CheckCircle2,
    Lock,
    RefreshCcw,
    AlertCircle,
    Sparkles,
} from "lucide-react";


import type { EthicsQuestionDto, EthicsCategoryDto, EthicsOptionDto } from "@/api/services/ethics/superVendor/types";
import {useMyEthicsQuestionnaire} from "@/hooks/SuperVendor/useMyEthicsQuestionnaire";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmitted?: () => void;
};

const isMultiple = (t?: string) => (t ?? "Single").toLowerCase() === "multiple";

export const BrandEthicsQuestionnaireModal: React.FC<Props> = ({
                                                                   open,
                                                                   onClose,
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

    const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

    // Auto-select first category
    React.useEffect(() => {
        if (!form?.categories?.length) return;
        if (activeCategoryKey) return;
        setActiveCategoryKey(form.categories[0]?.key ?? null);
    }, [form, activeCategoryKey]);

    const statusConfig = useMemo(() => {
        const s = (status ?? "Draft").toLowerCase();
        if (s === "approved") return {
            badge: "bg-green-100 text-green-700 border-green-300",
            icon: <CheckCircle2 size={14} />,
            label: "Approuvé"
        };
        if (s === "rejected") return {
            badge: "bg-red-100 text-red-700 border-red-300",
            icon: <AlertCircle size={14} />,
            label: "Rejeté"
        };
        if (s === "submitted" || s === "pending") return {
            badge: "bg-blue-100 text-blue-700 border-blue-300",
            icon: <Send size={14} />,
            label: "En cours de validation"
        };
        return {
            badge: "bg-orange-100 text-orange-700 border-orange-300",
            icon: <Sparkles size={14} />,
            label: "Brouillon"
        };
    }, [status]);

    const activeCategory = useMemo(() => {
        if (!activeCategoryKey || !form?.categories) return null;
        return form.categories.find((c: EthicsCategoryDto) => c.key === activeCategoryKey);
    }, [activeCategoryKey, form]);

    const categoryProgress = useMemo(() => {
        const map = new Map<string, { done: number; total: number }>();

        form?.categories?.forEach((cat: EthicsCategoryDto) => {
            let done = 0;
            let total = 0;

            cat.questions?.forEach((q: EthicsQuestionDto) => {
                total++;
                if (q.selectedOptionIds && q.selectedOptionIds.length > 0) {
                    done++;
                }
            });

            map.set(cat.key, { done, total });
        });

        return map;
    }, [form]);

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
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={saving ? undefined : onClose}
                aria-hidden="true"
            />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="relative px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold">Questionnaire éthique</h2>

                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.badge}`}>
                                        {statusConfig.icon}
                                        {statusConfig.label}
                                    </span>

                                    {locked && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30">
                                            <Lock size={14} /> Verrouillé
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-white/90">
                                    {locked
                                        ? "Ce questionnaire est clôturé et ne peut plus être modifié."
                                        : "Répondez aux questions sur vos pratiques éthiques et durables."}
                                </p>

                                {/* Progress Bar */}
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold">
                                            Progression globale
                                        </span>
                                        <span className="text-white/90">
                                            {progress.done} / {progress.total} questions
                                        </span>
                                    </div>
                                    <div className="h-3 bg-white/20 rounded-full overflow-hidden border border-white/30">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                                            style={{
                                                width:
                                                    progress.total > 0
                                                        ? `${Math.round((progress.done / progress.total) * 100)}%`
                                                        : "0%",
                                            }}
                                        />
                                    </div>
                                    {isComplete && (
                                        <div className="flex items-center gap-2 text-sm text-green-300 font-semibold">
                                            <CheckCircle2 size={16} />
                                            Questionnaire complet ! Vous pouvez le soumettre.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
                                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors"
                                aria-label="Fermer"
                                title="Fermer"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 flex items-start gap-2 text-sm bg-red-500 text-white rounded-lg p-3 border border-red-400">
                                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Categories Tabs */}
                    {!loading && form?.categories && (
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {form.categories.map((cat: EthicsCategoryDto) => {
                                    const isActive = activeCategoryKey === cat.key;
                                    const catProg = categoryProgress.get(cat.key) || { done: 0, total: 0 };
                                    const percentage = catProg.total > 0
                                        ? Math.round((catProg.done / catProg.total) * 100)
                                        : 0;

                                    return (
                                        <button
                                            key={cat.key}
                                            onClick={() => setActiveCategoryKey(cat.key)}
                                            disabled={saving}
                                            className={[
                                                "flex-shrink-0 px-5 py-3 rounded-xl text-sm font-semibold transition-all border-2",
                                                isActive
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm",
                                                "disabled:opacity-50"
                                            ].join(" ")}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span>{cat.label}</span>
                                                <span className={[
                                                    "px-2 py-0.5 rounded-full text-xs font-bold",
                                                    isActive
                                                        ? "bg-white/20 text-white"
                                                        : percentage === 100
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                ].join(" ")}>
                                                    {catProg.done}/{catProg.total}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-12 flex flex-col items-center justify-center gap-4 text-gray-600">
                                <Loader2 className="animate-spin text-blue-600" size={40} />
                                <p className="text-lg font-semibold">Chargement du questionnaire...</p>
                            </div>
                        ) : !form ? (
                            <div className="p-12 text-center space-y-4">
                                <AlertCircle size={48} className="mx-auto text-red-500" />
                                <div className="text-lg font-semibold text-gray-900">
                                    Impossible de charger le questionnaire
                                </div>
                                <button
                                    type="button"
                                    onClick={refetch}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors"
                                >
                                    <RefreshCcw size={16} /> Réessayer
                                </button>
                            </div>
                        ) : !activeCategory ? (
                            <div className="p-12 text-center text-gray-500">
                                Sélectionnez une catégorie pour commencer
                            </div>
                        ) : (
                            <div className="p-6 space-y-4">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {activeCategory.label}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {(activeCategory.questions ?? []).length} question{(activeCategory.questions ?? []).length > 1 ? 's' : ''} dans cette catégorie
                                    </p>
                                </div>

                                {(activeCategory.questions ?? []).map((qu: EthicsQuestionDto, index: number) => {
                                    const multi = isMultiple(qu.answerType);
                                    const selected = qu.selectedOptionIds ?? [];
                                    const isAnswered = selected.length > 0;

                                    return (
                                        <div
                                            key={qu.id}
                                            className={[
                                                "border-2 rounded-2xl p-5 transition-all",
                                                isAnswered
                                                    ? "border-green-200 bg-green-50/30"
                                                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                            ].join(" ")}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Question number badge */}
                                                <div className={[
                                                    "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm",
                                                    isAnswered
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-100 text-gray-600"
                                                ].join(" ")}>
                                                    {isAnswered ? <CheckCircle2 size={20} /> : index + 1}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3 mb-3">
                                                        <div className="flex-1">
                                                            <h4 className="text-base font-semibold text-gray-900 leading-tight">
                                                                {qu.label}
                                                            </h4>
                                                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                                <span className="px-2 py-0.5 bg-gray-100 rounded font-mono">
                                                                    {qu.key}
                                                                </span>
                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">
                                                                    {multi ? "Choix multiples" : "Choix unique"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {(qu.options ?? []).map((opt: EthicsOptionDto) => {
                                                            const active = selected.includes(opt.id);
                                                            const disabled = locked || saving;

                                                            return (
                                                                <label
                                                                    key={opt.id}
                                                                    className={[
                                                                        "flex items-start gap-3 p-4 rounded-xl border-2 transition-all group",
                                                                        active
                                                                            ? "border-blue-600 bg-blue-50 shadow-sm"
                                                                            : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30",
                                                                        disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="flex-shrink-0 pt-0.5">
                                                                        {multi ? (
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={active}
                                                                                disabled={disabled}
                                                                                onChange={() => pickAnswer(qu, opt.id)}
                                                                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                type="radio"
                                                                                name={`q_${qu.id}`}
                                                                                checked={active}
                                                                                disabled={disabled}
                                                                                onChange={() => pickAnswer(qu, opt.id)}
                                                                                className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                                            />
                                                                        )}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className={[
                                                                            "text-sm font-medium transition-colors",
                                                                            active ? "text-blue-900" : "text-gray-900"
                                                                        ].join(" ")}>
                                                                            {opt.label}
                                                                        </div>
                                                                        {opt.key && (
                                                                            <div className="mt-0.5 text-xs text-gray-500 font-mono">
                                                                                {opt.key}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {active && (
                                                                        <CheckCircle2 size={20} className="flex-shrink-0 text-blue-600" />
                                                                    )}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {(activeCategory.questions ?? []).length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        Aucune question dans cette catégorie
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                {locked
                                    ? "Ce questionnaire est verrouillé et ne peut plus être modifié."
                                    : isComplete
                                        ? "Toutes les questions ont été répondues. Vous pouvez soumettre votre questionnaire."
                                        : "N'oubliez pas d'enregistrer régulièrement votre progression."}
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={reset}
                                    disabled={locked || saving || loading || !form}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 font-semibold transition-colors"
                                >
                                    <RotateCcw size={16} /> Réinitialiser
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveDraft}
                                    disabled={locked || saving || loading || !form}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 font-semibold transition-colors"
                                    title="Sauvegarder en brouillon"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Enregistrer
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={locked || saving || loading || !form || !isComplete}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-blue-200 transition-all"
                                    title={!isComplete ? "Répondez à toutes les questions avant de soumettre" : "Soumettre le questionnaire"}
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Soumettre
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
