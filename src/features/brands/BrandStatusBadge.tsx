import React from "react";
import { useTranslation } from "react-i18next";
import {
    CheckCircle2,
    AlertCircle,
    Clock,
    FileEdit,
    XCircle,
    Sparkles
} from "lucide-react";
import { BrandStatus } from "@/api/services/brands/types";

interface BrandStatusBadgeProps {
    status: BrandStatus;
    className?: string;
}

export const BrandStatusBadge: React.FC<BrandStatusBadgeProps> = ({
                                                                      status,
                                                                      className = ""
                                                                  }) => {
    const { t } = useTranslation();

    const config = React.useMemo(() => {
        switch (status) {
            case BrandStatus.Approved:
                return {
                    label: t('brand.status.approved'),
                    icon: <CheckCircle2 size={16} />,
                    className: "bg-green-100 text-green-700 border-green-300"
                };
            case BrandStatus.Submitted:
                return {
                    label: t('brand.status.submitted'),
                    icon: <Clock size={16} />,
                    className: "bg-blue-100 text-blue-700 border-blue-300"
                };
            case BrandStatus.PendingUpdate:
                return {
                    label: t('brand.status.pending_update'),
                    icon: <FileEdit size={16} />,
                    className: "bg-amber-100 text-amber-700 border-amber-300"
                };
            case BrandStatus.Rejected:
                return {
                    label: t('brand.status.rejected'),
                    icon: <XCircle size={16} />,
                    className: "bg-red-100 text-red-700 border-red-300"
                };
            case BrandStatus.Disabled:
                return {
                    label: t('brand.status.disabled'),
                    icon: <AlertCircle size={16} />,
                    className: "bg-gray-100 text-gray-700 border-gray-300"
                };
            case BrandStatus.Draft:
            default:
                return {
                    label: t('brand.status.draft'),
                    icon: <Sparkles size={16} />,
                    className: "bg-orange-100 text-orange-700 border-orange-300"
                };
        }
    }, [status, t]);

    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border-2 ${config.className} ${className}`}
        >
            {config.icon}
            {config.label}
        </span>
    );
};