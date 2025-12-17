import React, { useMemo } from "react";
import { AlertTriangle, Leaf, Star, CheckCircle2, Clock, XCircle } from "lucide-react";

type QuestionnaireStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | string;

type Props = {
    brandId: number; // tu peux le garder si tu en as besoin ailleurs
    questionnaireStatus?: QuestionnaireStatus; // 👈 vient du back (EthicsFormDto.status)
    ethicsScoreProduction: number; // 0..5 (officiel si Approved, sinon potentiellement 0)
    ethicsScoreTransport: number;  // 0..5
    ethicTags?: string[];
    onOpen: () => void;
};

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const BrandEthicsCallout: React.FC<Props> = ({
                                                        questionnaireStatus,
                                                        ethicsScoreProduction,
                                                        ethicsScoreTransport,
                                                        ethicTags,
                                                        onOpen,
                                                    }) => {
    const status = (questionnaireStatus ?? "Draft") as QuestionnaireStatus;

    const production = useMemo(
        () => round1(clamp(ethicsScoreProduction ?? 0, 0, 5)),
        [ethicsScoreProduction]
    );

    const transport = useMemo(
        () => round1(clamp(ethicsScoreTransport ?? 0, 0, 5)),
        [ethicsScoreTransport]
    );

    const overall = useMemo(() => round1(clamp((production + transport) / 2, 0, 5)), [production, transport]);

    // ✅ Règle simple:
    // - Draft => pas complété (notification)
    // - Submitted => complété mais en vérification (notification)
    // - Approved/Rejected => questionnaire traité
    const isCompleted = status !== "Draft";
    const isUnderReview = status === "Submitted";
    const isApproved = status === "Approved";
    const isRejected = status === "Rejected";

    const title = useMemo(() => {
        if (!isCompleted) return "Questionnaire éthique à compléter";
        if (isUnderReview) return "Questionnaire envoyé (en cours de vérification)";
        if (isApproved) return "Questionnaire validé";
        if (isRejected) return "Questionnaire refusé (à corriger)";
        return "Questionnaire éthique";
    }, [isCompleted, isUnderReview, isApproved, isRejected]);

    const subtitle = useMemo(() => {
        if (!isCompleted) return "Remplis le questionnaire pour afficher ton score et tes labels sur ta page.";
        if (isUnderReview) return "Tes réponses ont été envoyées. Un administrateur va les vérifier.";
        if (isApproved) return "Ton score officiel est publié sur ta page marque.";
        if (isRejected) return "Corrige tes réponses puis renvoie le questionnaire.";
        return "Gère tes informations éthiques.";
    }, [isCompleted, isUnderReview, isApproved, isRejected]);

    const Icon = useMemo(() => {
        if (!isCompleted) return AlertTriangle;
        if (isUnderReview) return Clock;
        if (isApproved) return CheckCircle2;
        if (isRejected) return XCircle;
        return Leaf;
    }, [isCompleted, isUnderReview, isApproved, isRejected]);

    return (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4">
            <div className="flex items-start gap-3">
                <div className={(!isCompleted || isRejected) ? "mt-0.5 text-amber-600" : "mt-0.5 text-gray-900"}>
                    <Icon size={18} />
                </div>

                <div className="flex-1">
                    <div className="font-semibold text-gray-900">{title}</div>
                    <div className="text-sm text-gray-600 mt-1">{subtitle}</div>

                    {/* Affichage score uniquement si Approved (score officiel) */}
                    {isApproved ? (
                        <>
                            <div className="mt-3 flex items-center gap-3">
                                <StarRating value={overall} />
                                <div className="text-sm text-gray-700">
                                    <span className="font-semibold text-gray-900">{overall.toFixed(1)}</span>/5
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mt-2">
                                Transport {transport.toFixed(1)}/5 • Production {production.toFixed(1)}/5
                            </div>

                            {(ethicTags?.length ?? 0) > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {ethicTags!.slice(0, 6).map((t) => (
                                        <span
                                            key={t}
                                            className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-700"
                                        >
                      {t}
                    </span>
                                    ))}
                                </div>
                            ) : null}
                        </>
                    ) : null}

                    <button
                        type="button"
                        onClick={onOpen}
                        className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4"
                    >
                        {isCompleted ? "Voir / modifier le questionnaire →" : "Remplir le questionnaire éthique →"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const StarRating: React.FC<{ value: number }> = ({ value }) => {
    const v = clamp(value, 0, 5);

    return (
        <div className="flex items-center gap-1" aria-label={`Note ${v.toFixed(1)} sur 5`}>
            {Array.from({ length: 5 }).map((_, i) => {
                const fill = clamp(v - i, 0, 1);
                const pct = `${fill * 100}%`;

                return (
                    <span key={i} className="relative inline-block w-[18px] h-[18px]">
            <Star size={18} className="absolute inset-0 text-gray-300" fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: pct }}>
              <Star size={18} className="text-gray-900" fill="currentColor" />
            </span>
          </span>
                );
            })}
        </div>
    );
};
