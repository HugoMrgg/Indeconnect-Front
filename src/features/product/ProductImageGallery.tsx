import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductMedia } from "@/types/Product";

interface Props {
    images: ProductMedia[];
}

export function ProductImageGallery({ images }: Props) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<number>(
        images.find(m => m.isPrimary)?.id || images[0].id
    );

    const current = images.find(m => m.id === selected);

    return (
        <div className="flex gap-4">
            {/* MINIATURES VERTICALES */}
            <div className="flex flex-col gap-3">
                {images.map((img, index) => (
                    <img
                        key={img.id || index}
                        src={img.url}
                        onClick={() => setSelected(img.id)}
                        className={`
                            w-20 h-20 object-cover rounded-lg cursor-pointer border
                            ${img.id === selected ? "border-black" : "border-gray-300 opacity-70"}
                        `}
                        alt={t('product.image_gallery.thumbnail_alt', { number: index + 1 })}
                    />
                ))}
            </div>

            {/* IMAGE PRINCIPALE */}
            {/* fixe la taille */}
            <div className="flex-1 flex items-center justify-center">
                {current ? (
                    <img
                        src={current?.url}
                        className="h-[600px] object-contain rounded-xl shadow-lg"
                        alt={t('product.image_gallery.main_alt')}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                        {t('product.image_gallery.unavailable')}
                    </div>
                )}
            </div>
        </div>
    );
}
