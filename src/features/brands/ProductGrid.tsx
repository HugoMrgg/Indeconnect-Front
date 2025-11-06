import ProductCard from "@/components/cards/ProductCard";
import { Product } from "@/types/Product";

export const ProductGrid = ({ items }: { items: Product[] }) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
            <ProductCard key={p.id} product={p} />
        ))}
    </div>
);
