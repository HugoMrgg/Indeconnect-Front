import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Tag } from "@/components/cards/Tag";
import { Product } from "@/types/Product";

import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const { brandName } = useParams();
    const encodedBrand = encodeURIComponent(brandName ?? "");

    return (
        <div onClick={() => navigate(`/brand/${encodeURIComponent(encodedBrand)}/${product.id}`)}
            className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden font-poppins">
            <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                        Image non disponible
                    </div>
                )}

                <button
                    onClick={() => setLiked((v) => !v)}
                    aria-label="Ajouter aux favoris"
                    className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm transition hover:bg-white"
                >
                    <Heart
                        className={`h-5 w-5 transition-colors duration-200 ${
                            liked ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                    />
                </button>
            </div>

            <div className="flex flex-col flex-grow p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                    {product.category || "T-shirt grimelins"}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 leading-snug">
                    {product.name}
                </h3>
                <p className="mt-2 text-base font-bold text-gray-800">
                    € {product.price.toFixed(2)}
                </p>
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
