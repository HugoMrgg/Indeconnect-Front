import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import type { RecommendedProduct } from "@/api/services/recommendations";

interface RecommendedProductCardProps {
    product: RecommendedProduct;
    showReason?: boolean;
}

export function RecommendedProductCard({
                                           product,
                                           showReason = true
                                       }: RecommendedProductCardProps) {
    const navigate = useNavigate();

    // Gestion sécurisée des prix
    const displayPrice = product.salePrice ?? product.basePrice ?? 0;
    const hasDiscount = product.salePrice !== null && product.salePrice !== undefined;

    const handleClick = () => {
        if (product.brandName) {
            navigate(`/brand/${encodeURIComponent(product.brandName)}/product/${product.id}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
        >
            {/* Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">Pas d'image</span>
                    </div>
                )}

                {/* Badge de score */}
                {product.recommendationScore > 0 && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                        {product.recommendationScore.toFixed(1)}
                    </div>
                )}

                {/* Badge de réduction */}
                {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        PROMO
                    </div>
                )}
            </div>

            {/* Contenu */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>

                {product.brandName && (
                    <p className="text-sm text-gray-500 mb-2">{product.brandName}</p>
                )}

                {/* Prix */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">
                        €{displayPrice.toFixed(2)}
                    </span>
                    {hasDiscount && product.basePrice && (
                        <span className="text-sm text-gray-500 line-through">
                            €{product.basePrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Rating */}
                {product.reviewsCount > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                            {product.averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                            ({product.reviewsCount})
                        </span>
                    </div>
                )}

                {/* Raison de la recommandation */}
                {showReason && product.recommendationReason && (
                    <div className="mt-2">
                        <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded line-clamp-2">
                            {product.recommendationReason}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
