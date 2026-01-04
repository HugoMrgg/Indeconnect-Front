import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBrandForModeration } from "@/hooks/Admin/useBrandForModeration";
import { useBrandModeration } from "@/hooks/Admin/useBrandModeration";
import { BrandStatusBadge } from "@/features/brands/BrandStatusBadge";
import { BrandStatus } from "@/api/services/brands/types";
import { BrandPageLayout } from "@/features/brands/BrandPageLayout";
import {
    Loader2,
    AlertCircle,
    CheckCircle,
    XCircle,
    ArrowLeft,
    User,
    MapPin,
    Mail,
    DollarSign,
    Package,
    Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS, nl, de } from "date-fns/locale";

export const BrandModerationDetailPage: React.FC = () => {
    const { brandId } = useParams<{ brandId: string }>();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const { brand, loading, error, refetch } = useBrandForModeration(Number(brandId));
    const { approving, rejecting, approveBrand, rejectBrand } = useBrandModeration();

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // ✅ Sélectionner la locale date-fns selon la langue
    const dateLocale = {
        fr,
        en: enUS,
        nl,
        de
    }[i18n.language] || fr;

    const handleApprove = async () => {
        if (!brand) return;

        const success = await approveBrand(brand.id);
        if (success) {
            setTimeout(() => navigate("/moderator/brands"), 1500);
        }
    };

    const handleReject = async () => {
        if (!brand || !rejectReason.trim()) return;

        const success = await rejectBrand(brand.id, rejectReason.trim());
        if (success) {
            setShowRejectModal(false);
            setRejectReason("");
            setTimeout(() => navigate("/moderator/brands"), 1500);
        }
    };

    if (loading) {
        return (
            <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-lg font-semibold text-gray-600">
                        {t('moderator.brand_detail.loading')}
                    </p>
                </div>
            </BrandPageLayout>
        );
    }

    if (error || !brand) {
        return (
            <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <AlertCircle size={48} className="text-red-500" />
                    <p className="text-lg font-semibold text-gray-900">{t('moderator.brand_detail.error_title')}</p>
                    <p className="text-gray-600">{error || t('moderator.brand_detail.error_not_found')}</p>
                    <button
                        onClick={() => navigate("/moderator/brands")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        {t('moderator.brand_detail.back_to_list')}
                    </button>
                </div>
            </BrandPageLayout>
        );
    }

    const isUpdate = brand.status === BrandStatus.PendingUpdate;
    const canModerate = brand.status === BrandStatus.Submitted || brand.status === BrandStatus.PendingUpdate;

    return (
        <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
            <div className="px-6 mt-6">
                <div className="max-w-5xl mx-auto">
                    {/* Bouton retour */}
                    <button
                        onClick={() => navigate("/moderator/brands")}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
                    >
                        <ArrowLeft size={20} />
                        {t('moderator.brand_detail.back_to_list')}
                    </button>

                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
                        <div className="flex items-start gap-6 mb-6">
                            {/* Logo */}
                            {brand.logoUrl ? (
                                <img
                                    src={brand.logoUrl}
                                    alt={brand.name}
                                    className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                                    <Package size={40} className="text-gray-400" />
                                </div>
                            )}

                            {/* Infos principales */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {brand.name}
                                        </h1>
                                        {isUpdate && (
                                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-lg">
                                                {t('moderator.brand_detail.existing_brand_update')}
                                            </span>
                                        )}
                                    </div>
                                    <BrandStatusBadge status={brand.status} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gray-400" />
                                        <span>{brand.superVendorEmail}</span>
                                    </div>

                                    {brand.contact && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-gray-400" />
                                            <span>{brand.contact}</span>
                                        </div>
                                    )}

                                    {brand.priceRange && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} className="text-gray-400" />
                                            <span>{t('moderator.brand_detail.price_range', { range: brand.priceRange })}</span>
                                        </div>
                                    )}

                                    {brand.deposits.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span>{brand.deposits[0].city}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions de modération */}
                        {canModerate && (
                            <div className="flex gap-3 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleApprove}
                                    disabled={approving || rejecting}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-semibold transition-colors disabled:cursor-not-allowed shadow-lg shadow-green-200"
                                >
                                    {approving ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            {t('moderator.brand_detail.approving')}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            {t('moderator.brand_detail.approve_button')}
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={approving || rejecting}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-colors disabled:cursor-not-allowed shadow-lg shadow-red-200"
                                >
                                    <XCircle size={20} />
                                    {t('moderator.brand_detail.reject_button')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Scores éthiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                {t('moderator.brand_detail.score_production')}
                            </h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {(brand.ethicsScoreProduction / 20).toFixed(1)} / 5
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                {t('moderator.brand_detail.score_transport')}
                            </h3>
                            <p className="text-3xl font-bold text-green-600">
                                {(brand.ethicsScoreTransport / 20).toFixed(1)} / 5
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    {brand.description && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('moderator.brand_detail.description_title')}</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{brand.description}</p>
                        </div>
                    )}

                    {/* À propos */}
                    {brand.aboutUs && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('moderator.brand_detail.about_title')}</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{brand.aboutUs}</p>
                        </div>
                    )}

                    {/* Où nous trouver */}
                    {brand.whereAreWe && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('moderator.brand_detail.where_to_find_title')}</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{brand.whereAreWe}</p>
                        </div>
                    )}

                    {/* Autres informations */}
                    {brand.otherInfo && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('moderator.brand_detail.other_info_title')}</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{brand.otherInfo}</p>
                        </div>
                    )}

                    {/* Dépôts */}
                    {brand.deposits.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('moderator.brand_detail.stores_title')}</h2>
                            <div className="space-y-3">
                                {brand.deposits.map((deposit) => (
                                    <div
                                        key={deposit.id}
                                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                                    >
                                        <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{deposit.city}</p>
                                            <p className="text-sm text-gray-600">{deposit.fullAddress}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags éthiques */}
                    {brand.ethicTags.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('moderator.brand_detail.ethic_tags_title')}</h2>
                            <div className="flex flex-wrap gap-2">
                                {brand.ethicTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Historique de modération */}
                    {brand.history.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('moderator.brand_detail.history_title')}</h2>
                            <div className="space-y-3">
                                {brand.history.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                                    >
                                        <Clock size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-900">
                                                    {entry.action === "Approved" && t('moderator.brand_detail.action_approved')}
                                                    {entry.action === "Rejected" && t('moderator.brand_detail.action_rejected')}
                                                    {entry.action === "Submitted" && t('moderator.brand_detail.action_submitted')}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {t('moderator.brand_detail.action_by', { moderator: entry.moderatorEmail })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {formatDistanceToNow(new Date(entry.createdAt), {
                                                    addSuffix: true,
                                                    locale: dateLocale
                                                })}
                                            </p>
                                            {entry.comment && (
                                                <p className="mt-2 text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                                                    {entry.comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de rejet */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => !rejecting && setShowRejectModal(false)}
                    />

                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle size={24} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {t('moderator.brand_detail.reject_modal_title')}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {brand.name}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('moderator.brand_detail.reject_modal_reason_label')} <span className="text-red-600">{t('moderator.brand_detail.reject_modal_reason_required')}</span>
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder={t('moderator.brand_detail.reject_modal_placeholder')}
                                disabled={rejecting}
                                rows={6}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {t('moderator.brand_detail.reject_modal_hint')}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                disabled={rejecting}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('moderator.brand_detail.reject_modal_cancel')}
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={rejecting || !rejectReason.trim()}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-colors disabled:cursor-not-allowed"
                            >
                                {rejecting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        {t('moderator.brand_detail.reject_modal_rejecting')}
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={18} />
                                        {t('moderator.brand_detail.reject_modal_confirm')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </BrandPageLayout>
    );
};