import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { BrandStatus } from "@/api/services/brands/types";
import { brandsService } from "@/api/services/brands";
import toast from "react-hot-toast";

interface BrandSubmitSectionProps {
    brandId: number;
    status: BrandStatus;
    latestRejectionComment?: string | null;
    onSubmitted?: () => void;
}

export const BrandSubmitSection: React.FC<BrandSubmitSectionProps> = ({
                                                                          brandId,
                                                                          status,
                                                                          latestRejectionComment,
                                                                          onSubmitted
                                                                      }) => {
    const { t } = useTranslation();
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = status === BrandStatus.Draft || status === BrandStatus.Rejected;
    const isWaiting = status === BrandStatus.Submitted || status === BrandStatus.PendingUpdate;

    const handleSubmit = async () => {
        if (!canSubmit) return;

        try {
            setSubmitting(true);
            await brandsService.submitBrand(brandId);
            toast.success(t('brand.submit.success_toast'), {
                icon: "✅",
                duration: 4000
            });
            onSubmitted?.();
        } catch (error: any) {
            toast.error(
                error?.message || t('brand.submit.error_toast'),
                { icon: "❌" }
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Si rejetée, afficher le commentaire du modérateur
    if (status === BrandStatus.Rejected && latestRejectionComment) {
        return (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-900 mb-2">
                            {t('brand.submit.rejected_title')}
                        </h3>
                        <p className="text-sm text-red-800 mb-4">
                            <strong>{t('brand.submit.reason_label')}</strong> {latestRejectionComment}
                        </p>
                        <p className="text-sm text-red-700 mb-4">
                            {t('brand.submit.rejected_message')}
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                            {submitting ? t('brand.submit.submitting') : t('brand.submit.resubmit_button')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Si en attente de validation
    if (isWaiting) {
        return (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-blue-900 mb-2">
                            {status === BrandStatus.Submitted
                                ? t('brand.submit.pending_title')
                                : t('brand.submit.pending_update_title')
                            }
                        </h3>
                        <p className="text-sm text-blue-800">
                            {t('brand.submit.pending_message', {
                                type: status === BrandStatus.Submitted
                                    ? t('brand.submit.type_brand')
                                    : t('brand.submit.type_update')
                            })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Si brouillon (Draft) - bouton pour soumettre
    if (status === BrandStatus.Draft) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {t('brand.submit.draft_title')}
                        </h3>
                        <p className="text-sm text-gray-700 mb-4">
                            {t('brand.submit.draft_message')}
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                        >
                            <Send size={18} />
                            {submitting ? t('brand.submit.submitting') : t('brand.submit.submit_button')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};