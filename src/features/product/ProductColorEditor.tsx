import React from "react";
import { useTranslation } from "react-i18next";
import { useColors } from "@/hooks/Color/useColors";
import { Loader2 } from "lucide-react";

interface ProductColorEditorProps {
    currentColorId: number | null;
    onSelectColor: (colorId: number) => void;
}

export function ProductColorEditor({
                                       currentColorId,
                                       onSelectColor,
                                   }: ProductColorEditorProps) {
    const { t } = useTranslation();
    const { colors, loading, error } = useColors();

    if (loading) {
        return (
            <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">{t('add_product.color_editor.title')}</h3>
                <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 size={20} className="animate-spin" />
                    {t('add_product.color_editor.loading')}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">{t('add_product.color_editor.title')}</h3>
                <div className="text-red-500 bg-red-50 rounded-lg p-4">{error}</div>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
                {t('add_product.color_editor.title')} <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600">
                {t('add_product.color_editor.description')}
            </p>

            <div className="grid grid-cols-3 gap-3">
                {colors.map((color) => (
                    <button
                        key={color.id}
                        type="button"
                        onClick={() => onSelectColor(color.id)}
                        className={`p-3 border-2 rounded-lg flex items-center gap-3 transition ${
                            currentColorId === color.id
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        <div
                            className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                            style={{ backgroundColor: color.hexa }}
                        />
                        <span className="text-sm font-medium">{color.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
