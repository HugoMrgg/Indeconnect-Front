import React from "react";

import SortBar from "@/features/sorting/SortBar";
import { ProductGrid } from "./ProductGrid";
import { ProductList } from "./ProductList";
import { Product } from "@/types/Product";

/* ✅ Typage propre de l'objet retourné par useProductFilters */
interface ProductFiltersState {
    filtered: Product[];
    sort: "featured" | "price_asc" | "price_desc";
    setSort: (v: "featured" | "price_asc" | "price_desc") => void;
    view: "grid" | "list";
    setView: (v: "grid" | "list") => void;
}

interface Props {
    filter: ProductFiltersState;
}

export const BrandProducts: React.FC<Props> = ({ filter }) => {
    const { filtered, sort, setSort, view, setView } = filter;

    // --- Affichage normal ---
    return (
        <section className="space-y-4">
            <SortBar
                count={filtered.length}
                sort={sort}
                setSort={setSort}
                view={view}
                setView={setView}
            />

            {view === "grid" ? (
                <ProductGrid items={filtered} />
            ) : (
                <ProductList items={filtered} />
            )}
        </section>
    );
};
