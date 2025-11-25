import React from "react";
import { ColorVariant, Color } from "@/types/Product";

interface Props {
    current: Color | null;
    variants: ColorVariant[];
    onSelect: (variant: ColorVariant) => void;
}

export function ProductColorSelector({ current, variants, onSelect }: Props) {
    return (
        <div className="mt-6">
            <div className="font-semibold mb-2">Couleur</div>
            <div className="flex gap-4">
                {variants.map(v => (
                    <button
                        key={v.productId}
                        onClick={() => onSelect(v)}
                        className={`
                            w-10 h-10 rounded-full border transition
                            ${current?.id === v.colorId
                            ? "border-black scale-110"
                            : "border-gray-300 opacity-70 hover:opacity-100"}
                        `}
                        style={{ backgroundColor: v.colorHexa || "#ccc" }}
                    />
                ))}
            </div>
        </div>
    );
}
