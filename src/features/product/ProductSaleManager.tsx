import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Percent } from "lucide-react";

interface SaleData {
    id?: number;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    description?: string;
}

interface ProductSaleManagerProps {
    currentSale: SaleData | null;
    onSave: (sale: SaleData) => void;
    onClose: () => void;
}

export function ProductSaleManager({
                                       currentSale,
                                       onSave,
                                       onClose,
                                   }: ProductSaleManagerProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<SaleData>({
        discountPercentage: currentSale?.discountPercentage || 10,
        startDate: currentSale?.startDate || new Date().toISOString().split('T')[0],
        endDate: currentSale?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: currentSale?.description || "",
    });

    const [errors, setErrors] = useState<string[]>([]);

    const validate = () => {
        const errs: string[] = [];

        if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
            errs.push(t('product.sale_manager.errors.discount_range'));
        }

        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            errs.push(t('product.sale_manager.errors.date_range'));
        }

        setErrors(errs);
        return errs.length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Percent size={28} className="text-red-600" />
                        {currentSale ? t('product.sale_manager.title.edit') : t('product.sale_manager.title.new')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                        {errors.map((err, idx) => (
                            <p key={idx} className="text-sm text-red-700">• {err}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pourcentage de réduction */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            {t('product.sale_manager.fields.discount')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={formData.discountPercentage}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        discountPercentage: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-2xl font-bold text-center"
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-red-600">
                                %
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            {t('product.sale_manager.fields.discount_hint')}
                        </p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                {t('product.sale_manager.fields.start_date')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, startDate: e.target.value })
                                }
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                {t('product.sale_manager.fields.end_date')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, endDate: e.target.value })
                                }
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Description (optionnel) */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            {t('product.sale_manager.fields.description')}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                            rows={3}
                            placeholder={t('product.sale_manager.fields.description_placeholder')}
                        />
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            {t('product.sale_manager.actions.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            {currentSale ? t('product.sale_manager.actions.edit') : t('product.sale_manager.actions.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
