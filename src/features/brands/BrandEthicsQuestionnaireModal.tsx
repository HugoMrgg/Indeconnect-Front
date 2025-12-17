/*
import React, { useMemo } from "react";
import { X, Star, Send } from "lucide-react";
import toast from "react-hot-toast"; // ✅

import {
    EthicsCategory,
    type EthicsQuestionDTO,
    type EthicsOptionDTO,
} from "@/features/brands/ethics/stubEthicsData";
import {useBrandQuestionnaireStub} from "@/hooks/Brand/useBrandQuestionnaireStub";

type Props = {
    brandId: number;
    open: boolean;
    onClose: () => void;
    searchQuery?: string;
    onSubmitted?: () => void; // ✅ AJOUT
};

export const BrandEthicsQuestionnaireModal: React.FC<Props> = ({
                                                                   brandId,
                                                                   open,
                                                                   onClose,
                                                                   searchQuery = "",
                                                                   onSubmitted, // ✅
                                                               }) => {
    const qcm = useBrandQuestionnaireStub(brandId);

    const q = searchQuery.trim().toLowerCase();

    const filteredQuestions = useMemo(() => {
        if (!q) return qcm.questions;
        return qcm.questions.filter((qu: { label: string; options: any[]; }) => {
            const inQ = qu.label.toLowerCase().includes(q);
            const inOpt = qu.options.some((o) => o.label.toLowerCase().includes(q));
            return inQ || inOpt;
        });
    }, [q, qcm.questions]);

    const groups = useMemo(() => {
        const transport = filteredQuestions.filter(
            (x) => x.category === EthicsCategory.Transport
        );
        const prod = filteredQuestions.filter(
            (x) => x.category === EthicsCategory.MaterialsManufacturing
        );
        return { transport, prod };
    }, [filteredQuestions]);

    // ✅ handler submit
    const handleSubmit = async () => {
        const ok = await qcm.submit();
        if (!ok) return;

        toast.success("Formulaire envoyé ✅", {
            style: { borderRadius: "10px", background: "#000", color: "#fff" },
        });

        onClose();          // ✅ ferme la modal
        onSubmitted?.();    // ✅ optionnel (si tu veux déclencher autre chose)
    };

    if (!open) return null;

    if (qcm.loading) {
        return (
            <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
                    <p className="text-gray-500 animate-pulse">
                        Chargement du questionnaire…
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/40">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                    {/!* Header *!/}
                    <div className="p-5 border-b border-gray-200 flex items-start justify-between gap-4">
                        <div>
                            <div className="text-lg font-semibold text-gray-900">
                                Questionnaire éthique
                            </div>
                            <div className="text-sm text-gray-500">
                                Score global :{" "}
                                <span className="font-semibold text-gray-900">
                  {qcm.scores.overallLabel}
                </span>
                                /5 ⭐
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Transport {qcm.scores.transportLabel}/5 • Production{" "}
                                {qcm.scores.productionLabel}/5
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                            aria-label="Fermer"
                            type="button"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/!* Body *!/}
                    <div className="p-5 max-h-[70vh] overflow-auto space-y-6">
                        {qcm.error ? (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                                {qcm.error}
                            </div>
                        ) : null}

                        <Section
                            title="Transport"
                            questions={groups.transport}
                            answers={qcm.answers}
                            onPick={qcm.setAnswer}
                        />

                        <Section
                            title="Matériaux & Fabrication"
                            questions={groups.prod}
                            answers={qcm.answers}
                            onPick={qcm.setAnswer}
                        />

                        {filteredQuestions.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-600">
                                    Aucune question ne correspond à ta recherche.
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {/!* Footer *!/}
                    <div className="p-5 border-t border-gray-200 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={qcm.reset}
                            className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4"
                        >
                            Réinitialiser
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={qcm.approve}
                                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm"
                                title="DEV only : simuler validation modérateur"
                            >
                                <Star size={16} />
                                DEV Approve
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit} // ✅ ICI
                                disabled={!qcm.isComplete}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                <Send size={16} />
                                Soumettre
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Section({
                     title,
                     questions,
                     answers,
                     onPick,
                 }: {
    title: string;
    questions: EthicsQuestionDTO[];
    answers: Record<number, number>;
    onPick: (questionId: number, optionId: number) => void;
}) {
    if (!questions.length) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="font-semibold text-gray-900 mb-4">{title}</div>

            <div className="space-y-5">
                {questions.map((qu) => (
                    <div key={qu.id} className="p-4 rounded-xl border border-gray-200">
                        <div className="font-medium text-gray-900">{qu.label}</div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {qu.options.map((opt: EthicsOptionDTO) => {
                                const selected = answers[qu.id] === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => onPick(qu.id, opt.id)}
                                        className={[
                                            "text-left p-3 rounded-lg border transition",
                                            selected
                                                ? "border-gray-900 bg-gray-900 text-white"
                                                : "border-gray-200 hover:bg-gray-50",
                                        ].join(" ")}
                                    >
                                        <div className="font-semibold">{opt.label}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
*/
import React, { useMemo } from "react";
import { X, Send } from "lucide-react";
import toast from "react-hot-toast";
import {EthicsQuestionDto} from "@/api/services/ethics/superVendor/types";
import {useMyEthicsQuestionnaire} from "@/hooks/SuperVendor/useMyEthicsQuestionnaire";




// ✅ TON hook déjà créé (aucun axios ici)


type Props = {
    brandId: number; // pas utilisé par l’API (le back le déduit du user), mais tu peux le garder.
    open: boolean;
    onClose: () => void;
    searchQuery?: string;
    onSubmitted?: () => void;
};

export const BrandEthicsQuestionnaireModal: React.FC<Props> = ({
                                                                   open,
                                                                   onClose,
                                                                   searchQuery = "",
                                                                   onSubmitted,
                                                               }) => {
    /**
     * ✅ IMPORTANT : ici tu ne touches pas à l’API.
     * Ton hook doit faire :
     * - GET quand open=true
     * - gérer les answers (Single/Multiple) et la complétion
     * - PUT submit quand submit() est appelé
     */
    const {
        form,          // EthicsFormDto | null
        loading,
        saving,
        error,
        pickAnswer,    // (question: EthicsQuestionDto, optionId: number) => void
        reset,         // () => void
        submit,        // () => Promise<boolean>
        isComplete,    // boolean
        progress,      // { done: number; total: number }
        status,        // string (Draft/Submitted/Approved/Rejected)
    } = useMyEthicsQuestionnaire(open);

    const q = searchQuery.trim().toLowerCase();

    const filteredCategories = useMemo(() => {
        if (!form) return [];

        if (!q) return form.categories;

        return form.categories
            .map((c) => {
                const questions = c.questions.filter((qu) => {
                    const inQ = qu.label.toLowerCase().includes(q) || qu.key.toLowerCase().includes(q);
                    const inOpt = qu.options.some(
                        (o) => o.label.toLowerCase().includes(q) || o.key.toLowerCase().includes(q)
                    );
                    return inQ || inOpt;
                });
                return { ...c, questions };
            })
            .filter((c) => c.questions.length > 0);
    }, [form, q]);

    const locked = status === "Approved" || status === "Rejected";

    const handleSubmit = async () => {
        if (locked) return;

        const ok = await submit();
        if (!ok) return;

        toast.success("Formulaire envoyé ✅", {
            style: { borderRadius: "10px", background: "#000", color: "#fff" },
        });

        onClose();
        onSubmitted?.();
    };

    if (!open) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
                    <p className="text-gray-500 animate-pulse">Chargement du questionnaire…</p>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-lg font-semibold text-gray-900">Questionnaire éthique</div>
                            <div className="text-sm text-red-700 mt-2">
                                Impossible de charger le questionnaire{error ? ` : ${error}` : "."}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                            aria-label="Fermer"
                            type="button"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/40">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-200 flex items-start justify-between gap-4">
                        <div>
                            <div className="text-lg font-semibold text-gray-900">Questionnaire éthique</div>

                            <div className="text-sm text-gray-600 mt-1">
                                Statut : <span className="font-semibold text-gray-900">{status}</span>
                                {" • "}
                                Complété :{" "}
                                <span className="font-semibold text-gray-900">
                  {progress.done}/{progress.total}
                </span>
                            </div>

                            {locked ? (
                                <div className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                                    Questionnaire clôturé ({status}) : consultation uniquement.
                                </div>
                            ) : null}

                            {error ? (
                                <div className="text-xs text-red-700 mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                                    {error}
                                </div>
                            ) : null}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                            aria-label="Fermer"
                            type="button"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5 max-h-[70vh] overflow-auto space-y-6">
                        {filteredCategories.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-600">Aucune question ne correspond à ta recherche.</p>
                            </div>
                        ) : (
                            filteredCategories
                                .sort((a, b) => a.order - b.order)
                                .map((cat) => (
                                    <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                                        <div className="font-semibold text-gray-900 mb-4">{cat.label}</div>

                                        <div className="space-y-5">
                                            {cat.questions
                                                .slice()
                                                .sort((a: { order: number; }, b: { order: number; }) => a.order - b.order)
                                                .map((qu) => (
                                                    <div key={qu.id} className="p-4 rounded-xl border border-gray-200">
                                                        <div className="font-medium text-gray-900">{qu.label}</div>

                                                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {qu.options
                                                                .slice()
                                                                .sort((a, b) => a.order - b.order)
                                                                .map((opt) => {
                                                                    const selected = (qu.selectedOptionIds ?? []).includes(opt.id);

                                                                    return (
                                                                        <button
                                                                            key={opt.id}
                                                                            type="button"
                                                                            disabled={locked}
                                                                            onClick={() => pickAnswer(qu as unknown as EthicsQuestionDto, opt.id)}
                                                                            className={[
                                                                                "text-left p-3 rounded-lg border transition",
                                                                                selected
                                                                                    ? "border-gray-900 bg-gray-900 text-white"
                                                                                    : "border-gray-200 hover:bg-gray-50",
                                                                                locked ? "opacity-60 cursor-not-allowed" : "",
                                                                            ].join(" ")}
                                                                        >
                                                                            <div className="font-semibold">{opt.label}</div>
                                                                        </button>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-gray-200 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={reset}
                            disabled={locked || saving}
                            className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4 disabled:opacity-50"
                        >
                            Réinitialiser
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={locked || saving || !isComplete}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                            title={!isComplete ? "Tu dois répondre à toutes les questions avant de soumettre." : undefined}
                        >
                            <Send size={16} />
                            {saving ? "Envoi..." : "Soumettre"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
