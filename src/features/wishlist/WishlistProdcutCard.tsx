import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import React from "react";

interface WishlistProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        primaryImageUrl: string;
        primaryColor?: { name: string; hexa: string };
        brandName: string;
    };
    onRemove: (productId: number) => void;
}

export function WishlistProductCard({ product, onRemove }: WishlistProductCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { brandName } = useParams();

    const encodedBrand = encodeURIComponent(product.brandName ?? brandName ?? "");

    const openProduct = () => {
        navigate(`/brand/${encodedBrand}/product/${product.id}`);
    };

    return (
        <div
            className="relative group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm
                       hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer
                       max-w-[170px] w-full">
            {/* IMAGE */}
            <div
                onClick={openProduct}
                className="relative w-full h-40 bg-gray-100 overflow-hidden sm:h-44 md:h-48">
                {product.primaryImageUrl ? (
                    <img
                        src={product.primaryImageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center
                                   transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                        {t('wishlist.product_card.no_image')}
                    </div>
                )}

                {/* BADGE COULEUR */}
                {product.primaryColor && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm
                                    rounded-full px-2.5 py-1 shadow-sm text-xs">
                        <div
                            className="w-2.5 h-2.5 rounded-full border border-gray-300"
                            style={{ backgroundColor: product.primaryColor.hexa }}
                        />
                        <span className="text-gray-700 font-medium">
                            {product.primaryColor.name}
                        </span>
                    </div>
                )}

                {/* BOUTON SUPPRIMER */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(product.id);
                    }}
                    className="absolute bottom-2 right-2 flex items-center gap-1
                        bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full
                        text-red-600 text-xs font-semibold shadow hover:bg-white
                        transition-all">
                    {t('wishlist.product_card.remove')}
                    <X className="w-3 h-3" />
                </button>
            </div>

            {/* INFO PRODUIT */}
            <div className="p-2.5 text-left">
                <p className="text-[9px] uppercase tracking-wide text-gray-500">
                    {t('wishlist.product_card.product_label')}
                </p>

                <h3 className="mt-1 text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                    {product.name}
                </h3>

                <p className="mt-1 text-base font-bold text-gray-800">
                    € {product.price.toFixed(2)}
                </p>
            </div>
        </div>
    );
}
