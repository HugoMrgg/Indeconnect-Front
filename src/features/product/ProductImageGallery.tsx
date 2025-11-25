import React, { useState } from "react";
import { ProductMedia } from "@/types/Product";

interface Props {
    images: ProductMedia[];
}

export function ProductImageGallery({ images }: Props) {
    const [selected, setSelected] = useState<number>(
        images.find(m => m.isPrimary)?.id || images[0].id
    );

    const current = images.find(m => m.id === selected);

    return (
        <div className="flex gap-4">
            {/* MINIATURES VERTICALES */}
            <div className="flex flex-col gap-3">
                {images.map(img => (
                    <img
                        key={img.id}
                        src={"../../../images/"+img.url}
                        onClick={() => setSelected(img.id)}
                        className={`
                            w-20 h-20 object-cover rounded-lg cursor-pointer border
                            ${img.id === selected ? "border-black" : "border-gray-300 opacity-70"}
                        `}
                    />
                ))}
            </div>

            {/* IMAGE PRINCIPALE */}
            {/* fixe la taille */}
            <div className="flex-1 flex items-center justify-center">
                {current ? (
                    <img
                    src={"../../../images/"+current?.url}
                    className="h-[600px] object-contain rounded-xl shadow-lg"
                    alt={current?.url}/>
                ) : (
                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                    Image indisponible
                </div>
                )}
            </div>
        </div>
    );
}
