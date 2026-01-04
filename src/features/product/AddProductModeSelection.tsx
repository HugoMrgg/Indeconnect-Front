import React from "react";
import { Plus, X, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddProductModeSelectionProps {
    onSelectMode: (mode: "new-group" | "add-to-group") => void;
    onCancel: () => void;
}

export function AddProductModeSelection({ onSelectMode, onCancel }: AddProductModeSelectionProps) {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{t('products.add_product.title')}</h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <p className="text-gray-600 mb-8">
                    {t('products.add_product.mode_title')}
                </p>

                <div className="grid grid-cols-2 gap-6">
                    <button
                        onClick={() => onSelectMode("new-group")}
                        className="group p-6 border-2 border-gray-200 hover:border-blue-500 rounded-xl transition-all hover:shadow-lg"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition">
                            <Plus size={32} className="text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{t('products.add_product.mode_new_type')}</h3>
                        <p className="text-sm text-gray-600">
                            {t('products.add_product.mode_new_type_desc')}
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectMode("add-to-group")}
                        className="group p-6 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all hover:shadow-lg"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition">
                            <Package size={32} className="text-green-600" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{t('products.add_product.mode_add_color')}</h3>
                        <p className="text-sm text-gray-600">
                            {t('products.add_product.mode_add_color_desc')}
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}
