import React from "react";
import {Product} from "@/types/Product";
import {Heart} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
export const ProductList = ({
                                items,
                                likedMap,
                                toggleLike
                            }: {
    items: Product[];
    likedMap: Record<number, boolean>;
    toggleLike: (id: number) => void;
}) => {
    const navigate = useNavigate();
    const { brandName } = useParams();
    const encodedBrand = encodeURIComponent(brandName ?? "");
    return (
        <div className="space-y-3">
            {items.map((p) => (
                <div
                    key={p.id}
                    onClick={() =>
                        navigate(`/brand/${encodedBrand}/product/${p.id}`)
                    }
                    className="relative flex items-center gap-4 rounded-xl border p-3 cursor-pointer hover:bg-gray-50 transition"
                >
                    <img
                        src={p.primaryImageUrl || p.image}
                        alt={p.name}
                        className="h-20 w-20 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>€ {p.price.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(p.id);
                        }}
                        className="absolute right-3 top-3"
                    >
                        <Heart
                            className={`h-6 w-6 transition-colors ${
                                likedMap[p.id]
                                    ? "text-red-500 fill-red-500"
                                    : "text-gray-500"
                            }`}
                        />
                    </button>
                </div>
            ))}
        </div>
    );
};
