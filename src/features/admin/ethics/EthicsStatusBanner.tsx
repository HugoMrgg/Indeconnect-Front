/*
/!*
import React from "react";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import type { QuestionnaireStatus } from "@/api/services/ethics/types";

type Props = {
    status: QuestionnaireStatus;
    onApprove?: () => void;
    onReject?: () => void;
    onBackToDraft?: () => void;
    disabled?: boolean;
};

export const EthicsStatusBanner: React.FC<Props> = ({
                                                        status,
                                                        onApprove,
                                                        onReject,
                                                        onBackToDraft,
                                                        disabled,
                                                    }) => {
    const meta = getMeta(status);

    return (
        <div className={`rounded-2xl border p-4 ${meta.wrapper}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <meta.Icon className={meta.icon} size={20} />
                    <div>
                        <div className="font-semibold text-gray-900">{meta.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{meta.desc}</div>
                    </div>
                </div>

                {/!* Actions admin *!/}
                <div className="flex gap-2">
                    {status === "Submitted" && (
                        <>
                            <button
                                type="button"
                                onClick={onReject}
                                disabled={disabled}
                                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                                Rejeter
                            </button>
                            <button
                                type="button"
                                onClick={onApprove}
                                disabled={disabled}
                                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                            >
                                Approuver
                            </button>
                        </>
                    )}

                    {status === "Rejected" && (
                        <button
                            type="button"
                            onClick={onBackToDraft}
                            disabled={disabled}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            Repasser en brouillon
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

function getMeta(status: QuestionnaireStatus) {
    switch (status) {
        case "Draft":
            return {
                Icon: FileText,
                title: "Brouillon",
                desc: "Tu peux modifier librement. Rien n’est encore en attente d’approbation.",
                wrapper: "border-gray-200 bg-white",
                icon: "text-gray-700",
            };
        case "Submitted":
            return {
                Icon: Clock,
                title: "En attente d’approbation",
                desc: "Lecture seule. Approuve ou rejette ce questionnaire.",
                wrapper: "border-amber-200 bg-amber-50",
                icon: "text-amber-700",
            };
        case "Approved":
            return {
                Icon: CheckCircle2,
                title: "Approuvé",
                desc: "Lecture seule. Pour modifier, crée une nouvelle version (ou repasse en brouillon selon la règle métier).",
                wrapper: "border-emerald-200 bg-emerald-50",
                icon: "text-emerald-700",
            };
        case "Rejected":
            return {
                Icon: XCircle,
                title: "Rejeté",
                desc: "Modifie et repasse en brouillon / re-soumets ensuite.",
                wrapper: "border-red-200 bg-red-50",
                icon: "text-red-700",
            };
    }
}
*!/
import React, { useMemo } from "react";
import { CheckCircle2, XCircle, Clock3, FileEdit, ShieldCheck } from "lucide-react";

type Props = {
    status: string;
    disabled?: boolean;
    onApprove: () => void;
    onReject: () => void;
    onBackToDraft: () => void;
};

const mapStatus = (s: string) => {
    switch (s) {
        case "Draft":
            return { label: "Brouillon", icon: FileEdit, tone: "bg-white border-gray-200 text-gray-900" };
        case "Submitted":
            return { label: "En attente d’approbation", icon: Clock3, tone: "bg-amber-50 border-amber-200 text-amber-900" };
        case "Approved":
            return { label: "Approuvé", icon: ShieldCheck, tone: "bg-emerald-50 border-emerald-200 text-emerald-900" };
        case "Rejected":
            return { label: "Refusé", icon: XCircle, tone: "bg-red-50 border-red-200 text-red-900" };
        case "Published":
            return { label: "Publié", icon: CheckCircle2, tone: "bg-emerald-50 border-emerald-200 text-emerald-900" };
        default:
            return { label: s, icon: FileEdit, tone: "bg-white border-gray-200 text-gray-900" };
    }
};

export const EthicsStatusBanner: React.FC<Props> = ({
                                                        status,
                                                        disabled,
                                                        onApprove,
                                                        onReject,
                                                        onBackToDraft,
                                                    }) => {
    const meta = useMemo(() => mapStatus(status), [status]);
    const Icon = meta.icon;

    // Actions selon le statut (simple & clair)
    const canApproveReject = status === "Submitted";
    const canBackToDraft = status === "Rejected" || status === "Approved" || status === "Published";

    return (
        <div className={`rounded-2xl border p-4 ${meta.tone}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Icon className="mt-0.5" size={18} />
                    <div>
                        <div className="font-semibold">Statut : {meta.label}</div>
                        <div className="text-sm opacity-90 mt-1">
                            {status === "Draft" && "Éditable. Quand tu veux, tu peux le soumettre au workflow (si tu l’as prévu côté back)."}
                            {status === "Submitted" && "Lecture seule. Tu peux approuver ou refuser ce catalogue."}
                            {status === "Approved" && "Lecture seule. Catalogue validé (tu peux le repasser en brouillon si besoin)."}
                            {status === "Rejected" && "Lecture seule. Corrige puis repasse en brouillon pour retravailler."}
                            {status === "Published" && "Lecture seule. Catalogue en production (à réserver aux versions stables)."}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                    {canBackToDraft ? (
                        <button
                            type="button"
                            onClick={onBackToDraft}
                            disabled={disabled}
                            className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                        >
                            Repasser en brouillon
                        </button>
                    ) : null}

                    {canApproveReject ? (
                        <>
                            <button
                                type="button"
                                onClick={onReject}
                                disabled={disabled}
                                className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"
                            >
                                Refuser
                            </button>
                            <button
                                type="button"
                                onClick={onApprove}
                                disabled={disabled}
                                className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                Approuver
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
*/
import React, { useMemo } from "react";
import { FileEdit, CheckCircle2, Archive } from "lucide-react";

type Props = {
    status: string;            // "Draft" | "Published" | "Archived" (optionnel)
    disabled?: boolean;
    onPublish?: () => void;    // action admin directe
    onUnpublish?: () => void;  // repasser en brouillon
};

const mapStatus = (s: string) => {
    switch (s) {
        case "Draft":
            return {
                label: "Brouillon",
                icon: FileEdit,
                tone: "bg-white border-gray-200 text-gray-900",
                desc: "Éditable. Quand tu publies, ce catalogue devient la référence.",
            };
        case "Published":
            return {
                label: "Publié",
                icon: CheckCircle2,
                tone: "bg-emerald-50 border-emerald-200 text-emerald-900",
                desc: "Catalogue en production. Modifs recommandées via retour en brouillon.",
            };
        case "Archived":
            return {
                label: "Archivé",
                icon: Archive,
                tone: "bg-gray-50 border-gray-200 text-gray-800",
                desc: "Historique. Lecture seule.",
            };
        default:
            return {
                label: s,
                icon: FileEdit,
                tone: "bg-white border-gray-200 text-gray-900",
                desc: "Statut inconnu.",
            };
    }
};

export const EthicsStatusBanner: React.FC<Props> = ({
                                                        status,
                                                        disabled,
                                                        onPublish,
                                                        onUnpublish,
                                                    }) => {
    const meta = useMemo(() => mapStatus(status), [status]);
    const Icon = meta.icon;

    const canPublish = status === "Draft" && !!onPublish;
    const canUnpublish = status === "Published" && !!onUnpublish;

    return (
        <div className={`rounded-2xl border p-4 ${meta.tone}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Icon className="mt-0.5" size={18} />
                    <div>
                        <div className="font-semibold">Statut : {meta.label}</div>
                        <div className="text-sm opacity-90 mt-1">{meta.desc}</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                    {canUnpublish ? (
                        <button
                            type="button"
                            onClick={onUnpublish}
                            disabled={disabled}
                            className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                        >
                            Repasser en brouillon
                        </button>
                    ) : null}

                    {canPublish ? (
                        <button
                            type="button"
                            onClick={onPublish}
                            disabled={disabled}
                            className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            Publier
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
