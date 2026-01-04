import React from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

interface AddProductCardProps {
    onClick: () => void;
}

export function AddProductCard({ onClick }: AddProductCardProps) {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-300 overflow-hidden h-full min-h-[400px] flex flex-col items-center justify-center p-6"
        >
            {/* Effet de fond animé */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 to-indigo-100/0 group-hover:from-blue-100/50 group-hover:to-indigo-100/50 transition-all duration-300" />

            {/* Contenu */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Icône avec animation */}
                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus
                        size={40}
                        className="text-blue-600 group-hover:text-blue-700 transition-colors"
                    />
                </div>

                {/* Texte */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {t('add_product_card.title')}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {t('add_product_card.description')}
                    </p>
                </div>

                {/* Badge indicatif */}
                <div className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full group-hover:bg-blue-700 transition-colors">
                    {t('add_product_card.badge')}
                </div>
            </div>

            {/* Motif décoratif */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-tr-full" />
        </button>
    );
}