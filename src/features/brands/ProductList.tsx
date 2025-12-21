import React, { useCallback } from "react";
import { Product } from "@/types/Product";
import { Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface ProductListProps {
    items: Product[];
    likedMap: Record<number, boolean>;
    toggleLike: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    items,
    likedMap,
    toggleLike
}) => {
    const navigate = useNavigate();
    const { brandName } = useParams();
    const encodedBrand = encodeURIComponent(brandName ?? "");

    const handleProductClick = useCallback((productId: number) => {
        navigate(`/brand/${encodedBrand}/product/${productId}`);
    }, [navigate, encodedBrand]);

    const handleLikeClick = useCallback((e: React.MouseEvent, productId: number) => {
        e.stopPropagation();
        toggleLike(productId);
    }, [toggleLike]);

    return (
        <div className="space-y-3">
            {items.map((p) => (
                <div
                    key={p.id}
                    onClick={() => handleProductClick(p.id)}
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
                        onClick={(e) => handleLikeClick(e, p.id)}
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

// Custom comparison function for React.memo
function arePropsEqual(prevProps: ProductListProps, nextProps: ProductListProps): boolean {
    // Check if the items array is the same length
    if (prevProps.items.length !== nextProps.items.length) {
        return false;
    }

    // Check if each item's relevant properties are the same
    for (let i = 0; i < prevProps.items.length; i++) {
        const prevItem = prevProps.items[i];
        const nextItem = nextProps.items[i];

        if (
            prevItem.id !== nextItem.id ||
            prevItem.name !== nextItem.name ||
            prevItem.price !== nextItem.price ||
            prevItem.primaryImageUrl !== nextItem.primaryImageUrl ||
            prevItem.image !== nextItem.image
        ) {
            return false;
        }
    }

    // Check if the likedMap has changed for any of the items
    for (const item of prevProps.items) {
        if (prevProps.likedMap[item.id] !== nextProps.likedMap[item.id]) {
            return false;
        }
    }

    return true;
}

export default React.memo(ProductList, arePropsEqual);
export { ProductList };
