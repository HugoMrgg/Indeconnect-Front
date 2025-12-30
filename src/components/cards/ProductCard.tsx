import { useParams, useNavigate } from "react-router-dom";

import { Tag } from "@/components/cards/Tag";
import { Product } from "@/types/Product";
import { calculatePrice } from "@/utils/priceCalculator";

import { Heart } from "lucide-react";

export default function ProductCard({
                                        product,
                                        liked,
                                        onToggleLike,
                                        showStatus = false,
                                        editMode = false,
                                    }: {
    product: Product;
    liked: boolean;
    onToggleLike: () => void;
    showStatus?: boolean;
    editMode?: boolean;
}) {
    const navigate = useNavigate();
    const { brandName } = useParams();
    const encodedBrand = encodeURIComponent(brandName ?? "");

    const handleClick = () => {
        if (editMode) {
            navigate(`/my-brand/product/${product.id}`);
        } else {
            navigate(`/brand/${encodedBrand}/product/${product.id}`);
        }
    };

    // ← NOUVEAU : Calculer le prix avec promo
    const { current, original, discount } = calculatePrice(product.price, product.sale);

    // Configuration des couleurs selon le statut
    const statusConfig = {
        Draft: {
            bg: "bg-amber-500",
            border: "border-amber-500",
            text: "Brouillon"
        },
        Online: {
            bg: "bg-green-500",
            border: "border-green-500",
            text: "En ligne"
        },
        Offline: {
            bg: "bg-gray-500",
            border: "border-gray-500",
            text: "Hors ligne"
        }
    };

    const status = product.status && showStatus ? statusConfig[product.status] : null;

    return (
        <div
            onClick={handleClick}
            className={`group relative flex flex-col rounded-2xl border-2 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden font-poppins cursor-pointer ${
                status ? status.border : "border-gray-200"
            }`}
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

                {/* Badge de promo (priorité sur statut et couleur) */}
                {discount && !status && (
                    <div className="absolute left-3 top-3 flex items-center gap-2 bg-red-500 text-white rounded-lg px-3 py-1.5 shadow-md z-20 font-bold text-xs">
                        -{discount}%
                    </div>
                )}

                {/* Badge de statut (supervendeur uniquement) */}
                {status && (
                    <div className={`absolute left-3 top-3 flex items-center gap-2 ${status.bg} text-white rounded-lg px-3 py-1.5 shadow-md z-20 font-semibold text-xs`}>
                        {status.text}
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

                {/* Badge couleur (si pas de promo ni statut) */}
                {product.primaryColor && !status && !discount && (
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

                {/* ← MODIFIÉ : Affichage des prix avec promo */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {original ? (
                        <>
                            <p className="text-base font-bold text-red-600">
                                € {current.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                                € {original.toFixed(2)}
                            </p>
                        </>
                    ) : (
                        <p className="text-base font-bold text-gray-800">
                            € {current.toFixed(2)}
                        </p>
                    )}

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