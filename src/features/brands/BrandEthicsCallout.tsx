import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Leaf, Star, CheckCircle2, Clock, XCircle, RefreshCcw } from "lucide-react";
import { EthicsSuperVendorQuestionnaireService } from "@/api/services/ethics/superVendor";

type QuestionnaireStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | string;

type Props = {
    brandId: number; // ok à garder
    questionnaireStatus?: QuestionnaireStatus; // si tu le passes, on le prend direct
    ethicsScoreProduction: number; // 0..5
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
    // --- status source (prop OR fetched) ---
    const [fetchedStatus, setFetchedStatus] = useState<QuestionnaireStatus | null>(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);

    const displayedStatus = (questionnaireStatus ?? fetchedStatus ?? "Draft") as QuestionnaireStatus;

    const production = useMemo(
        () => round1(clamp(ethicsScoreProduction ?? 0, 0, 5)),
        [ethicsScoreProduction]
    );

    const transport = useMemo(
        () => round1(clamp(ethicsScoreTransport ?? 0, 0, 5)),
        [ethicsScoreTransport]
    );

    const overall = useMemo(
        () => round1(clamp((production + transport) / 2, 0, 5)),
        [production, transport]
    );

    const isCompleted = displayedStatus !== "Draft";
    const isUnderReview = displayedStatus === "Submitted";
    const isApproved = displayedStatus === "Approved";
    const isRejected = displayedStatus === "Rejected";

    // --- animate / show "state changed" ---
    const prevStatusRef = useRef<QuestionnaireStatus>(displayedStatus);
    const [justChanged, setJustChanged] = useState(false);

    useEffect(() => {
        if (prevStatusRef.current !== displayedStatus) {
            prevStatusRef.current = displayedStatus;
            setJustChanged(true);
            const t = window.setTimeout(() => setJustChanged(false), 2200);
            return () => window.clearTimeout(t);
        }
    }, [displayedStatus]);

    const fetchStatus = useCallback(async () => {
        // Si on reçoit le status via props, pas besoin de fetch
        if (questionnaireStatus != null) return;

        setStatusLoading(true);
        setStatusError(null);
        try {
            const form = await EthicsSuperVendorQuestionnaireService.getMyForm();
            setFetchedStatus(form.status as QuestionnaireStatus);
        } catch (e: any) {
            setStatusError(e?.message ?? "Impossible de récupérer le statut du questionnaire.");
        } finally {
            setStatusLoading(false);
        }
    }, [questionnaireStatus]);

    // fetch au mount (si pas de status en props)
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // 🔔 écoute un event global pour refresh après save/submit du modal
    useEffect(() => {
        const handler = () => fetchStatus();
        window.addEventListener("ethics:updated", handler);
        return () => window.removeEventListener("ethics:updated", handler);
    }, [fetchStatus]);

    const title = useMemo(() => {
        if (!isCompleted) return "Questionnaire éthique à compléter";
        if (isUnderReview) return "Questionnaire envoyé";
        if (isApproved) return "Questionnaire validé";
        if (isRejected) return "Questionnaire refusé";
        return "Questionnaire éthique";
    }, [isCompleted, isUnderReview, isApproved, isRejected]);

    const subtitle = useMemo(() => {
        if (!isCompleted) return "Remplis le questionnaire pour afficher ton score et tes labels sur ta page.";
        if (isUnderReview) return "Tes réponses ont été envoyées. Vérification en cours.";
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

    const tone = useMemo(() => {
        // juste pour une UI qui “réagit”
        if (!isCompleted) return { wrap: "bg-amber-50 border-amber-200", icon: "text-amber-700", badge: "bg-amber-100 text-amber-900" };
        if (isUnderReview) return { wrap: "bg-blue-50 border-blue-200", icon: "text-blue-700", badge: "bg-blue-100 text-blue-900" };
        if (isApproved) return { wrap: "bg-emerald-50 border-emerald-200", icon: "text-emerald-700", badge: "bg-emerald-100 text-emerald-900" };
        if (isRejected) return { wrap: "bg-red-50 border-red-200", icon: "text-red-700", badge: "bg-red-100 text-red-900" };
        return { wrap: "bg-gray-50 border-gray-200", icon: "text-gray-900", badge: "bg-gray-100 text-gray-900" };
    }, [isCompleted, isUnderReview, isApproved, isRejected]);

    return (
        <div className={`border rounded-xl p-4 ${tone.wrap}`}>
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${tone.icon}`}>
                    <Icon size={18} />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-900">{title}</div>

                        <span className={`text-xs px-2 py-1 rounded-full ${tone.badge}`}>
              Statut : {displayedStatus}
            </span>

                        {justChanged ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-black text-white">
                Statut mis à jour ✓
              </span>
                        ) : null}
                    </div>

                    <div className="text-sm text-gray-700 mt-1">{subtitle}</div>

                    {statusError ? (
                        <div className="mt-2 text-xs text-red-700">
                            {statusError}
                            <button
                                type="button"
                                onClick={fetchStatus}
                                className="ml-2 inline-flex items-center gap-1 underline underline-offset-4"
                            >
                                <RefreshCcw size={12} /> Réessayer
                            </button>
                        </div>
                    ) : null}

                    {/* Affichage score uniquement si Approved */}
                    {isApproved ? (
                        <>
                            <div className="mt-3 flex items-center gap-3">
                                <StarRating value={overall} />
                                <div className="text-sm text-gray-800">
                                    <span className="font-semibold text-gray-900">{overall.toFixed(1)}</span>/5
                                </div>
                            </div>

                            <div className="text-sm text-gray-700 mt-2">
                                Transport {transport.toFixed(1)}/5 • Production {production.toFixed(1)}/5
                            </div>

                            {(ethicTags?.length ?? 0) > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {ethicTags!.slice(0, 6).map((t) => (
                                        <span
                                            key={t}
                                            className="text-xs px-2 py-1 rounded-full bg-white/70 border border-gray-200 text-gray-800"
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
                        className="mt-3 text-sm text-gray-700 hover:text-gray-900 underline underline-offset-4"
                    >
                        {statusLoading
                            ? "Mise à jour du statut…"
                            : isCompleted
                                ? "Voir / modifier le questionnaire →"
                                : "Remplir le questionnaire éthique →"}
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
