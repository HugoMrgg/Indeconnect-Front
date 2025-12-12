import { useParams, useNavigate } from "react-router-dom";

import { Tag } from "@/components/cards/Tag";
import { Product } from "@/types/Product";

import { Heart } from "lucide-react";

export default function ProductCard({
                                        product,
                                        liked,
                                        onToggleLike
                                    }: {
    product: Product;
    liked: boolean;
    onToggleLike: () => void;
}) {
    const navigate = useNavigate();
    const { brandName } = useParams();
    const encodedBrand = encodeURIComponent(brandName ?? "");

    return (
        <div
            onClick={() => navigate(`/brand/${encodeURIComponent(encodedBrand)}/product/${product.id}`)}
            className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden font-poppins cursor-pointer"
        >
            <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                {product.primaryImageUrl || product.image ? (
                    <img
                        src={product.primaryImageUrl || product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                        Image non disponible
                    </div>
                )}

                {/* Bouton favoris */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike();
                    }}
                    aria-label="Ajouter aux favoris"
                    className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm transition hover:bg-white z-10"
                >
                    <Heart
                        className={`h-5 w-5 transition-colors duration-200 ${
                            liked ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                    />
                </button>

                {/* Badge couleur */}
                {product.primaryColor && (
                    <div className="absolute left-3 top-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                        <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: product.primaryColor.hexa }}
                        />
                        <span className="text-xs font-medium text-gray-700">
                            {product.primaryColor.name}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-grow p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                    {product.category || "Produit"}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 leading-snug">
                    {product.name}
                </h3>

                <div className="mt-2 flex items-center gap-3">
                    <p className="text-base font-bold text-gray-800">
                        € {product.price.toFixed(2)}
                    </p>

                    {/* Rating */}
                    {product.reviewCount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <span>⭐</span>
                            <span>{product.averageRating.toFixed(1)}</span>
                            <span className="text-gray-400">({product.reviewCount})</span>
                        </div>
                    )}
                </div>

                {Array.isArray(product.tags) && product.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {product.tags.map((t) => (
                            <Tag key={t}>{t}</Tag>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
