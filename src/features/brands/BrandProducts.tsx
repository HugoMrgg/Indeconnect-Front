/*
import SortBar from "@/features/sorting/SortBar";
import { Loader2 } from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { ProductList } from "./ProductList";
import React from "react";

interface Props {
    filter: any; // ton hook retourne un objet structuré → tu peux typer plus tard
}

export const BrandProducts: React.FC<Props> = ({ filter }) => {
    const { filtered, sort, setSort, view, setView, loading } = filter;

    if (loading) {
        return (
            <div>
                <div className="flex items-center gap-2 mb-4 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Chargement des produits...</span>
                </div>
                <ProductGrid items={Array.from({ length: 8 }).map(() => ({
                    id: Math.random(),
                    name: "",
                    price: 0,
                    image: "",
                }))} />
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <SortBar count={filtered.length} sort={sort} setSort={setSort} view={view} setView={setView} />

            {view === "grid" ? (
                <ProductGrid items={filtered} />
            ) : (
                <ProductList items={filtered} />
            )}
        </section>
    );
};
*/
import SortBar from "@/features/sorting/SortBar";
import { Loader2 } from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { ProductList } from "./ProductList";
import React from "react";
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
