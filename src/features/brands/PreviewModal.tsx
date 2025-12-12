import React from "react";
import { X } from "lucide-react";
import { BrandPage } from "@/pages/brands/Brand";
import { Brand } from "@/types/brand";

interface PreviewModalProps {
    brand: Brand;
    onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ brand, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold">Aperçu client</h3>
                        <p className="text-sm text-gray-500">Voici comment les clients verront votre marque</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Contenu */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <BrandPage
                        brandId={brand.id}
                        brandData={brand}
                        editMode={false}
                    />
                </div>
            </div>
        </div>
    );
};
