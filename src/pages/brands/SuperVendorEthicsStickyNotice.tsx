import React, { useEffect, useMemo } from "react";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import {useMyEthicsQuestionnaire} from "@/hooks/SuperVendor/useMyEthicsQuestionnaire";


type Props = {
    onOpen: () => void;
    className?: string; // ex: "top-24" ou "top-28"
};

export function SuperVendorEthicsStickyNotice({ onOpen, className }: Props) {
    // On force le fetch même hors modal (ton hook fetch 1x)
    const { form, loading, error, status, refetch } = useMyEthicsQuestionnaire(true);

    // Quand le questionnaire est sauvegardé/soumis ailleurs, on refresh ici
    useEffect(() => {
        const handler = () => refetch();
        window.addEventListener("ethics:updated", handler);
        return () => window.removeEventListener("ethics:updated", handler);
    }, [refetch]);

    const isApproved = status === "Approved";
    const isDraft = status === "Draft";
    const isSubmitted = status === "Submitted";
    const isRejected = status === "Rejected";

    const shouldShow = useMemo(() => {
        // Afficher tant que pas validé officiellement
        return !isApproved;
    }, [isApproved]);

    if (!shouldShow) return null;

    const title =
        isDraft ? "Questionnaire éthique à compléter" :
            isSubmitted ? "Questionnaire envoyé (en vérification)" :
                isRejected ? "Questionnaire refusé (à corriger)" :
                    "Questionnaire éthique";

    const subtitle =
        isDraft ? "Complète-le pour afficher ton score et tes labels." :
            isSubmitted ? "Tes réponses ont été envoyées. En attente de validation." :
                isRejected ? "Corrige tes réponses puis renvoie le questionnaire." :
                    "Mets à jour tes réponses si nécessaire.";

    const Icon =
        isDraft ? AlertTriangle :
            isSubmitted ? Clock :
                isRejected ? AlertTriangle :
                    CheckCircle2;

    return (
        <div className={["fixed left-4 z-40", className ?? "top-24"].join(" ")}>
            <div className="w-[340px] rounded-2xl border border-gray-200 bg-white shadow-lg">
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <div className={(isDraft || isRejected) ? "text-amber-600 mt-0.5" : "text-gray-900 mt-0.5"}>
                            <Icon size={18} />
                        </div>

                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">{title}</div>
                            <div className="text-sm text-gray-600 mt-1">{subtitle}</div>

                            {error ? (
                                <div className="mt-2 text-xs text-red-600">{error}</div>
                            ) : null}

                            <div className="mt-3 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={onOpen}
                                    className="text-sm font-semibold text-gray-900 underline underline-offset-4"
                                >
                                    {isDraft ? "Voir / compléter →" : "Voir / modifier →"}
                                </button>

                                <span className="ml-auto text-xs text-gray-500">
                  {loading ? "Chargement…" : `Statut: ${status}`}
                </span>
                            </div>

                            {!loading && form?.questionnaireId ? (
                                <div className="mt-2 text-[11px] text-gray-400">
                                    Questionnaire #{form.questionnaireId}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
