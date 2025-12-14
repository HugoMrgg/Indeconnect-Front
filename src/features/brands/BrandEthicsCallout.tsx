import React, { useMemo } from "react";
import { AlertTriangle, Leaf, Star } from "lucide-react";
import {useBrandQuestionnaireStub} from "@/hooks/Brand/useBrandQuestionnaireStub";

type Props = {
    brandId: number;                 // 👈 AJOUT
    ethicsScoreProduction: number;    // 0..5
    ethicsScoreTransport: number;     // 0..5
    ethicTags?: string[];
    onOpen: () => void;
};

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const BrandEthicsCallout: React.FC<Props> = ({
                                                        brandId,
                                                        ethicsScoreProduction,
                                                        ethicsScoreTransport,
                                                        ethicTags,
                                                        onOpen,
                                                    }) => {
    // ✅ On lit le stub (localStorage) : permet au callout de se mettre à jour après "Soumettre"
    const qcm = useBrandQuestionnaireStub(brandId);

    // ✅ On décide quelle source utiliser :
    // - si questionnaire stub soumis -> on affiche les scores stub
    // - sinon -> on affiche les scores backend
    const useStub = useMemo(() => {
        return !!qcm.questionnaire?.submittedAt; // le plus fiable en stub
    }, [qcm.questionnaire?.submittedAt]);

    const production = useMemo(() => {
        const v = useStub ? qcm.scores.production : ethicsScoreProduction;
        return round1(clamp(v ?? 0, 0, 5));
    }, [useStub, qcm.scores.production, ethicsScoreProduction]);

    const transport = useMemo(() => {
        const v = useStub ? qcm.scores.transport : ethicsScoreTransport;
        return round1(clamp(v ?? 0, 0, 5));
    }, [useStub, qcm.scores.transport, ethicsScoreTransport]);

    const overall = useMemo(() => {
        return round1(clamp((production + transport) / 2, 0, 5));
    }, [production, transport]);
    useMemo(() => `${(overall / 5) * 100}%`, [overall]);

    // - stub: rempli si soumis
    // - backend fallback: tags ou scores > 0
    const isFilled = useMemo(() => {
        if (useStub) return true;

        const hasTags = (ethicTags?.length ?? 0) > 0;
        const hasScores = (ethicsScoreProduction ?? 0) > 0 || (ethicsScoreTransport ?? 0) > 0;
        return hasTags || hasScores;
    }, [useStub, ethicTags, ethicsScoreProduction, ethicsScoreTransport]);

    return (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4">
            {!isFilled ? (
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-amber-600">
                            <AlertTriangle size={18} />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                                Questionnaire éthique non complété
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                Pour afficher ton score éthique (0 à 5⭐) et tes labels, remplis le questionnaire.
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onOpen}
                        className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4"
                    >
                        Remplir le questionnaire éthique →
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-gray-900">
                            <Leaf size={18} />
                        </div>

                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">Score éthique</div>

                            <div className="mt-2 flex items-center gap-3">
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
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onOpen}
                        className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4"
                    >
                        Voir / modifier le questionnaire →
                    </button>
                </div>
            )}
        </div>
    );
};

const StarRating: React.FC<{ value: number }> = ({ value }) => {
    const v = clamp(value, 0, 5);

    return (
        <div className="flex items-center gap-1" aria-label={`Note ${v.toFixed(1)} sur 5`}>
            {Array.from({ length: 5 }).map((_, i) => {
                const fill = clamp(v - i, 0, 1); // 0..1
                const pct = `${fill * 100}%`;

                return (
                    <span key={i} className="relative inline-block w-[18px] h-[18px]">
            {/* étoile grise (fond) */}
                        <Star
                            size={18}
                            className="absolute inset-0 text-gray-300"
                            fill="currentColor"
                        />
                        {/* étoile remplie (avant), coupée selon pct */}
                        <span className="absolute inset-0 overflow-hidden" style={{ width: pct }}>
              <Star
                  size={18}
                  className="text-gray-900"
                  fill="currentColor"
              />
            </span>
          </span>
                );
            })}
        </div>
    );
};
