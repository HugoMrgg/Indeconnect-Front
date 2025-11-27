import {Product} from "@/types/Product";
import ProductCard from "@/components/cards/ProductCard";

export const ProductGrid = ({
                                items,
                                likedMap,
                                toggleLike
                            }: {
    items: Product[];
    likedMap: Record<number, boolean>;
    toggleLike: (id: number) => void;
}) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
            <ProductCard
                key={p.id}
                product={p}
                liked={likedMap[p.id] ?? false}
                onToggleLike={() => toggleLike(p.id)}
            />
        ))}
    </div>
);
