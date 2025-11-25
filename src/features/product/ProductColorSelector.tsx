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

            <div className="grid grid-cols-6 gap-3">
                {variants.map((v) => {
                    const selected = current?.id === v.colorId;

                    return (
                        <button
                            key={v.productId}
                            onClick={() => onSelect(v)}
                            className="flex flex-col items-center gap-1 group"
                        >
                            {/* Outer selectable circle */}
                            <div
                                className={`
                                    rounded-full transition-all
                                    ${selected ? "ring-2 ring-blue-500 scale-110" : ""}
                                `}
                                style={{
                                    padding: "3px",
                                }}
                            >
                                {/* Color bubble */}
                                <div
                                    className="w-8 h-8 rounded-full border border-gray-400"
                                    style={{
                                        backgroundColor: v.colorHexa || "#ccc",
                                    }}
                                />
                            </div>

                            {/* Color label */}
                            <span
                                className={`text-[11px] w-12 text-center ${
                                    selected ? "font-semibold" : ""
                                }`}
                            >
                                {v.colorName}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

