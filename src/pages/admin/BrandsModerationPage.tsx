import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBrandsForModeration } from "@/hooks/Admin/useBrandsForModeration";
import { BrandStatusBadge } from "@/features/brands/BrandStatusBadge";
import { BrandStatus } from "@/api/services/brands/types";
import { BrandPageLayout } from "@/features/brands/BrandPageLayout";
import {
    Loader2,
    AlertCircle,
    RefreshCcw,
    Search,
    Calendar,
    User,
    Package,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS, nl, de } from "date-fns/locale";

export const BrandsModerationPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { brands, loading, error, refetch } = useBrandsForModeration();
    const [searchQuery, setSearchQuery] = useState("");

    // ✅ Sélectionner la locale date-fns selon la langue
    const dateLocale = {
        fr,
        en: enUS,
        nl,
        de
    }[i18n.language] || fr;

    // Filtrer par recherche
    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return brands;

        const query = searchQuery.toLowerCase();
        return brands.filter(brand =>
            brand.name.toLowerCase().includes(query) ||
            brand.superVendorEmail.toLowerCase().includes(query)
        );
    }, [brands, searchQuery]);

    // Statistiques
    const stats = useMemo(() => {
        const submitted = brands.filter(b => b.status === BrandStatus.Submitted).length;
        const pendingUpdate = brands.filter(b => b.status === BrandStatus.PendingUpdate).length;

        return {
            total: brands.length,
            newBrands: submitted,
            updates: pendingUpdate
        };
    }, [brands]);

    if (loading) {
        return (
            <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-lg font-semibold text-gray-600">
                        {t('moderator.brands_list.loading')}
                    </p>
                </div>
            </BrandPageLayout>
        );
    }

    if (error) {
        return (
            <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <AlertCircle size={48} className="text-red-500" />
                    <p className="text-lg font-semibold text-gray-900">{t('moderator.brands_list.error_title')}</p>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCcw size={18} />
                        {t('moderator.brands_list.retry')}
                    </button>
                </div>
            </BrandPageLayout>
        );
    }

    return (
        <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
            {/* Hero Header */}
            <section className="px-6 mt-6">
                <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-xs tracking-widest uppercase text-gray-400">
                                {t('moderator.brands_list.subtitle')}
                            </p>
                            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                                {t('moderator.brands_list.title')}
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
                                {t('moderator.brands_list.description')}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                                <div className="flex items-center gap-2 text-blue-900 font-medium">
                                    <Package size={18} /> {t('moderator.brands_list.stats.total_pending')}
                                </div>
                                <p className="mt-1 text-2xl font-bold text-blue-900">
                                    {stats.total}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
                                <div className="flex items-center gap-2 text-green-900 font-medium">
                                    <AlertCircle size={18} /> {t('moderator.brands_list.stats.new_brands')}
                                </div>
                                <p className="mt-1 text-2xl font-bold text-green-900">
                                    {stats.newBrands}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                                <div className="flex items-center gap-2 text-amber-900 font-medium">
                                    <RefreshCcw size={18} /> {t('moderator.brands_list.stats.updates')}
                                </div>
                                <p className="mt-1 text-2xl font-bold text-amber-900">
                                    {stats.updates}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="px-6 mt-6">
                <div className="max-w-7xl mx-auto">
                    {/* Barre de recherche */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder={t('moderator.brands_list.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                        </div>
                    </div>

                    {/* Liste des marques */}
                    {filteredBrands.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <Package size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-lg font-semibold text-gray-900 mb-2">
                                {t('moderator.brands_list.no_brands_title')}
                            </p>
                            <p className="text-gray-600">
                                {searchQuery.trim()
                                    ? t('moderator.brands_list.no_search_results')
                                    : t('moderator.brands_list.all_processed')}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBrands.map((brand) => (
                                <div
                                    key={brand.id}
                                    onClick={() => navigate(`/moderator/brands/${brand.id}`)}
                                    className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-blue-300 hover:shadow-md p-6 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Logo */}
                                        {brand.logoUrl ? (
                                            <img
                                                src={brand.logoUrl}
                                                alt={brand.name}
                                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Package size={32} className="text-gray-400" />
                                            </div>
                                        )}

                                        {/* Contenu */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {brand.name}
                                                    </h3>
                                                    {brand.isUpdate && (
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                                                            {t('moderator.brands_list.update_badge')}
                                                        </span>
                                                    )}
                                                </div>
                                                <BrandStatusBadge status={brand.status} />
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1.5">
                                                    <User size={16} />
                                                    <span>{brand.superVendorEmail}</span>
                                                </div>

                                                {brand.submittedAt && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={16} />
                                                        <span>
                                                            {t('moderator.brands_list.submitted')} {formatDistanceToNow(new Date(brand.submittedAt), {
                                                            addSuffix: true,
                                                            locale: dateLocale
                                                        })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </BrandPageLayout>
    );
};