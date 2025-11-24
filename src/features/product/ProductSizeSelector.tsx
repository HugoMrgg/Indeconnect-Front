import React, { useState } from "react";
import { SizeVariant } from "@/types/Product";

interface Props {
    variants: SizeVariant[];
}

export function ProductSizeSelector({ variants }: Props) {
    const [selected, setSelected] = useState<number | null>(null);

    const handleSelect = (v: SizeVariant) => {
        if (!v.isAvailable) return;
        setSelected(v.id);
    };

    return (
        <div className="mt-6">
            <div className="font-semibold mb-2">Taille</div>
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
                                : selected === v.id
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
