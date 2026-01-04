import React, { useMemo } from "react";
import { FileEdit, CheckCircle2, Archive } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
    status: string;            // "Draft" | "Published" | "Archived" (optionnel)
    disabled?: boolean;
    onPublish?: () => void;    // action admin directe
    onUnpublish?: () => void;  // repasser en brouillon
};

const mapStatus = (s: string, t: (key: string) => string) => {
    switch (s) {
        case "Draft":
            return {
                label: t('ethics.status.draft'),
                icon: FileEdit,
                tone: "bg-white border-gray-200 text-gray-900",
                desc: t('ethics.status.draft_desc'),
            };
        case "Published":
            return {
                label: t('ethics.status.published'),
                icon: CheckCircle2,
                tone: "bg-emerald-50 border-emerald-200 text-emerald-900",
                desc: t('ethics.status.published_desc'),
            };
        case "Archived":
            return {
                label: t('ethics.status.archived'),
                icon: Archive,
                tone: "bg-gray-50 border-gray-200 text-gray-800",
                desc: t('ethics.status.archived_desc'),
            };
        default:
            return {
                label: s,
                icon: FileEdit,
                tone: "bg-white border-gray-200 text-gray-900",
                desc: t('ethics.status.unknown'),
            };
    }
};

export const EthicsStatusBanner: React.FC<Props> = ({
                                                        status,
                                                        disabled,
                                                        onPublish,
                                                        onUnpublish,
                                                    }) => {
    const { t } = useTranslation();
    const meta = useMemo(() => mapStatus(status, t), [status, t]);
    const Icon = meta.icon;

    const canPublish = status === "Draft" && !!onPublish;
    const canUnpublish = status === "Published" && !!onUnpublish;

    return (
        <div className={`rounded-2xl border p-4 ${meta.tone}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Icon className="mt-0.5" size={18} />
                    <div>
                        <div className="font-semibold">{t('ethics.status.label')}: {meta.label}</div>
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
                            {t('ethics.actions.back_to_draft')}
                        </button>
                    ) : null}

                    {canPublish ? (
                        <button
                            type="button"
                            onClick={onPublish}
                            disabled={disabled}
                            className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {t('ethics.actions.publish')}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
