import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save, X, Tag, Percent } from "lucide-react";
import { ProductSaleManager } from "./ProductSaleManager";

type ProductStatus = "Draft" | "Active" | "Online" | "Disabled";

interface SaleData {
    id?: number;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    description?: string;
}

interface ProductEditPanelProps {
    productId: number;
    status: ProductStatus;
    sale: SaleData | null;
    onStatusChange: (status: ProductStatus) => void;
    onSaleChange: (sale: SaleData | null) => void;
    onSave: () => Promise<void>;
    hasChanges: boolean;
    saving: boolean;
}

export function ProductEditPanel({
                                     productId: _productId,
                                     status,
                                     sale,
                                     onStatusChange,
                                     onSaleChange,
                                     onSave,
                                     hasChanges,
                                     saving,
                                 }: ProductEditPanelProps) {
    const { t } = useTranslation();
    const [showSaleManager, setShowSaleManager] = useState(false);

    const statusOptions: { value: ProductStatus; label: string; color: string }[] = [
        { value: "Draft", label: t('product.edit_panel.status.draft'), color: "bg-gray-500" },
        { value: "Active", label: t('product.edit_panel.status.active'), color: "bg-green-500" },
        { value: "Online", label: t('product.edit_panel.status.online'), color: "bg-blue-500" },
        { value: "Disabled", label: t('product.edit_panel.status.disabled'), color: "bg-red-500" },
    ];

    const currentStatusConfig = statusOptions.find(opt => opt.value === status);

    return (
        <>
            {/* Panel fixe à droite */}
            <div className="fixed top-20 right-8 w-80 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto z-40">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{t('product.edit_panel.title')}</h3>
                    {hasChanges && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    )}
                </div>

                {/* Statut du produit */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                        {t('product.edit_panel.status.label')}
                    </label>
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value as ProductStatus)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Badge visuel du statut */}
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${currentStatusConfig?.color}`} />
                        <span className="text-sm text-gray-600">
                            {currentStatusConfig?.label}
                        </span>
                    </div>
                </div>

                {/* Gestion des promotions */}
                <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-gray-700">
                            {t('product.edit_panel.sale.label')}
                        </label>
                        {sale && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                                <Percent size={12} />
                                -{sale.discountPercentage}%
                            </span>
                        )}
                    </div>

                    {sale ? (
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-2 border-red-200">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-700 font-medium">{t('product.edit_panel.sale.discount')}:</span>
                                    <span className="text-red-700 font-bold">
                                        {sale.discountPercentage}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700 font-medium">{t('product.edit_panel.sale.start')}:</span>
                                    <span className="text-gray-900">
                                        {new Date(sale.startDate).toLocaleDateString(t('common.locale'))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700 font-medium">{t('product.edit_panel.sale.end')}:</span>
                                    <span className="text-gray-900">
                                        {new Date(sale.endDate).toLocaleDateString(t('common.locale'))}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setShowSaleManager(true)}
                                    className="flex-1 px-3 py-2 bg-white border-2 border-red-300 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                                >
                                    {t('product.edit_panel.sale.edit')}
                                </button>
                                <button
                                    onClick={() => onSaleChange(null)}
                                    className="px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowSaleManager(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg text-red-700 font-semibold hover:from-red-100 hover:to-orange-100 transition"
                        >
                            <Tag size={20} />
                            {t('product.edit_panel.sale.add')}
                        </button>
                    )}
                </div>

                {/* Bouton sauvegarder */}
                <div className="pt-4 border-t">
                    <button
                        onClick={onSave}
                        disabled={!hasChanges || saving}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {t('product.edit_panel.save.saving')}
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                {hasChanges ? t('product.edit_panel.save.save') : t('product.edit_panel.save.no_changes')}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Modal ProductSaleManager */}
            {showSaleManager && (
                <ProductSaleManager
                    currentSale={sale}
                    onSave={(saleData) => {
                        onSaleChange(saleData);
                        setShowSaleManager(false);
                    }}
                    onClose={() => setShowSaleManager(false)}
                />
            )}
        </>
    );
}