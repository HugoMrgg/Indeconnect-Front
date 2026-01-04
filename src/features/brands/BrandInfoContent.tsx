import React from "react";
import { useTranslation } from "react-i18next";
import { EditableField } from "@/features/brands/edit/EditableField";
import { EditableSelect } from "@/features/brands/edit/EditableSelect";
import { EditableBrandFields } from "@/types/brand";
import { EditableLogo } from "@/features/brands/edit/EditableLogo";
import { DepositDTO } from "@/api/services/brands/types";

interface BrandInfoContentProps {
    brand: {
        name: string;
        logoUrl: string | null;
        bannerUrl: string | null;
        description: string | null;
        aboutUs: string | null;
        whereAreWe: string | null;
        otherInfo: string | null;
        contact: string | null;
        priceRange: string | null;
    };
    editMode?: boolean;
    onUpdateField?: <K extends keyof EditableBrandFields>(
        field: K,
        value: EditableBrandFields[K]
    ) => void;
    mainDeposit?: DepositDTO | null;
    onEditDeposit?: () => void;
    rightBottomAddon?: React.ReactNode;
}

export const BrandInfoContent: React.FC<BrandInfoContentProps> = ({
                                                                      brand,
                                                                      editMode = false,
                                                                      onUpdateField,
                                                                      mainDeposit,
                                                                      onEditDeposit,
                                                                  }) => {
    const { t } = useTranslation();
    const canEdit = editMode && !!onUpdateField;

    const PRICE_RANGE_OPTIONS = [
        {
            value: "€",
            label: t("brands.info.price_range_economy"), // ex: "€ - Économique"
        },
        {
            value: "€€",
            label: t("brands.info.price_range_mid"), // ex: "€€ - Moyen"
        },
        {
            value: "€€€",
            label: t("brands.info.price_range_premium"), // ex: "€€€ - Premium"
        },
    ];

    const getPriceRangeLabel = (value: string | null) => {
        if (!value) return null;
        switch (value) {
            case "€":
                return t("brands.info.price_range_economy");
            case "€€":
                return t("brands.info.price_range_mid");
            case "€€€":
                return t("brands.info.price_range_premium");
            default:
                return value;
        }
    };

    return (
        <>
            <section className="relative">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="shrink-0">
                        <EditableLogo
                            logoUrl={brand.logoUrl}
                            editMode={canEdit}
                            onUpdateField={onUpdateField}
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-gray-900">
                            {brand.name}
                        </h1>

                        {canEdit ? (
                            <div className="mt-2">
                                <EditableField
                                    value={brand.description}
                                    onChange={(value) => onUpdateField!("description", value)}
                                    placeholder={t("brands.details.about_us_placeholder")}
                                    className="text-sm sm:text-base text-gray-600 leading-relaxed block"
                                    multiline
                                    editMode={true}
                                />
                            </div>
                        ) : (
                            brand.description && (
                                <p className="mt-2 text-sm sm:text-base text-gray-600">
                                    {brand.description}
                                </p>
                            )
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Gamme de prix */}
                        {canEdit ? (
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-gray-500">
                                    {t("brands.info.price_range")}
                                </p>
                                <EditableSelect
                                    value={brand.priceRange}
                                    onChange={(value) => onUpdateField!("priceRange", value)}
                                    options={PRICE_RANGE_OPTIONS}
                                    placeholder={t("brands.info.select_price_range")}
                                    editMode={true}
                                    className="mt-1 text-sm text-gray-900"
                                />
                            </div>
                        ) : (
                            brand.priceRange && (
                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-wide text-gray-500">
                                        {t("brands.info.price_range")}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {getPriceRangeLabel(brand.priceRange)}
                                    </p>
                                </div>
                            )
                        )}

                        {(brand.contact || canEdit) && (
                            <div
                                className="hidden sm:block h-10 w-px bg-gray-200"
                                aria-hidden="true"
                            />
                        )}

                        {canEdit ? (
                            <div className="hidden sm:block text-right max-w-[220px]">
                                <p className="text-xs uppercase tracking-wide text-gray-500">
                                    {t("brands.details.contact")}
                                </p>
                                <EditableField
                                    value={brand.contact}
                                    onChange={(value) => onUpdateField!("contact", value)}
                                    placeholder={t("brands.details.contact_placeholder")}
                                    className="mt-1 text-sm text-gray-900 break-words"
                                    editMode={true}
                                />
                            </div>
                        ) : (
                            brand.contact && (
                                <div className="hidden sm:block text-right">
                                    <p className="text-xs uppercase tracking-wide text-gray-500">
                                        {t("brands.details.contact")}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                        {brand.contact}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

            <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* À propos */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                            {t("brands.info.about_title")}
                        </h2>
                        {canEdit ? (
                            <EditableField
                                value={brand.aboutUs}
                                onChange={(value) => onUpdateField!("aboutUs", value)}
                                placeholder={t("brands.details.about_us_placeholder")}
                                multiline
                                className="text-gray-700 leading-relaxed whitespace-pre-line"
                                editMode={true}
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {brand.aboutUs || t("brands.details.about_us_placeholder")}
                            </p>
                        )}
                    </section>

                    {/* Où nous trouver */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                            {t("brands.info.where_title")}
                        </h2>
                        {canEdit ? (
                            <EditableField
                                value={brand.whereAreWe}
                                onChange={(value) => onUpdateField!("whereAreWe", value)}
                                placeholder={t("brands.details.where_are_we_placeholder")}
                                multiline
                                className="text-gray-700 leading-relaxed whitespace-pre-line"
                                editMode={true}
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {brand.whereAreWe ||
                                    t("brands.details.where_are_we_placeholder")}
                            </p>
                        )}
                    </section>

                    {/* Autres informations */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                            {t("brands.info.other_title")}
                        </h2>
                        {canEdit ? (
                            <EditableField
                                value={brand.otherInfo}
                                onChange={(value) => onUpdateField!("otherInfo", value)}
                                placeholder={t("brands.details.other_info_placeholder")}
                                multiline
                                className="text-gray-700 leading-relaxed whitespace-pre-line"
                                editMode={true}
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {brand.otherInfo || t("brands.details.other_info_placeholder")}
                            </p>
                        )}
                    </section>
                </div>

                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            {t("brands.info.practical_info")}
                        </h3>

                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-gray-500">
                                    {t("brands.details.contact")}
                                </dt>
                                <dd className="mt-1 text-gray-900 break-words">
                                    {brand.contact || t("brands.details.contact_placeholder")}
                                </dd>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <dt className="text-gray-500">{t("brands.info.price_range")}</dt>
                                <dd className="mt-1 text-gray-900">
                                    {getPriceRangeLabel(brand.priceRange) ||
                                        t("brands.info.not_specified")}
                                </dd>
                            </div>

                            {canEdit && onEditDeposit && (
                                <div className="border-t border-gray-100 pt-4">
                                    <dt className="text-gray-500">
                                        {t("brands.info.main_deposit")}
                                    </dt>
                                    <dd className="mt-1">
                                        <button
                                            onClick={onEditDeposit}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            {mainDeposit?.city || t("brands.info.add_address")}
                                        </button>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </aside>
            </section>
        </>
    );
};
