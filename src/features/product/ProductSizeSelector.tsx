import React from "react";
import { useTranslation } from "react-i18next";
import { SizeVariant } from "@/types/Product";

interface Props {
    variants: SizeVariant[];
    selected?: SizeVariant;
    onSelect: (v: SizeVariant) => void;
}

export function ProductSizeSelector({ variants, selected, onSelect }: Props) {
    const { t } = useTranslation();

    const handleSelect = (v: SizeVariant) => {
        if (!v.isAvailable) return;
        onSelect(v);
    };

    return (
        <div className="mt-6">
            <div className="font-semibold mb-2">{t('product.size_selector.title')}</div>
            <div className="grid grid-cols-4 gap-3">
                {variants.map(v => (
                    <button
                        key={v.id}
                        onClick={() => handleSelect(v)}
                        className={`
                            px-4 py-2 rounded-lg border text-sm
                            ${
                            !v.isAvailable
                                ? "border-gray-300 opacity-40 cursor-not-allowed"
                                : selected?.id === v.id
                                    ? "bg-black text-white border-black"
                                    : "border-gray-600 hover:bg-gray-100"
                        }
                        `}
                    >
                        {v.size?.name || "?"}
                    </button>
                ))}
            </div>
        </div>
    );
}
