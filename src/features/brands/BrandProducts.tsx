import React, { useMemo } from "react";
import { useTranslation } from "react-i18next"; // ✅ Importer

import { userStorage } from "@/storage/UserStorage";
import { Product } from "@/types/Product";
import { useWishlistUI } from "@/hooks/User/useWishlistUI";

import SortBar from "@/features/sorting/SortBar";
import { ProductGrid } from "@/features/brands/ProductGrid";
import { ProductList } from "@/features/brands/ProductList";
import { AddProductCard } from "@/features/product/AddProductCard";
import ProductCard from "@/components/cards/ProductCard";

interface ProductFiltersState {
    filtered: Product[];
    sort: "featured" | "price_asc" | "price_desc";
    setSort: (v: "featured" | "price_asc" | "price_desc") => void;
    view: "grid" | "list";
    setView: (v: "grid" | "list") => void;
}

interface Props {
    filter: ProductFiltersState;
    searchQuery: string;
    canManageProducts?: boolean;
    onAddProduct?: () => void;
}

export const BrandProducts: React.FC<Props> = ({
                                                   filter,
                                                   searchQuery,
                                                   canManageProducts = false,
                                                   onAddProduct,
                                               }) => {
    const { t } = useTranslation(); // ✅ Hook de traduction
    const { filtered, sort, setSort, view, setView } = filter;

    const user = userStorage.getUser();

    const filteredByText = useMemo(() => {
        if (!searchQuery.trim()) return filtered;

        const query = searchQuery.toLowerCase();

        return filtered.filter((p) => {
            const matchName = p.name?.toLowerCase().includes(query);
            const matchDescription = p.description?.toLowerCase().includes(query);
            const matchColor = p.primaryColor?.name?.toLowerCase().includes(query);

            return matchName || matchDescription || matchColor;
        });
    }, [filtered, searchQuery]);

    const { likedMap, toggleLike } = useWishlistUI(user?.id, filteredByText);

    // ✅ Cas spécial : mode gestion sans produits
    if (canManageProducts && filteredByText.length === 0 && onAddProduct) {
        return (
            <section className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                    <p className="text-lg font-medium mb-2">
                        {t('brands.products.no_products')} {/* ✅ Traduit */}
                    </p>
                    <p className="text-sm">
                        {t('brands.products.add_first')} {/* ✅ Traduit */}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AddProductCard onClick={onAddProduct} />
                </div>
            </section>
        );
    }

    // Cas normal : pas de résultats
    if (filteredByText.length === 0) {
        return (
            <section className="space-y-4 py-10 text-center text-gray-500">
                <p className="text-lg">
                    {t('brands.products.no_results')} {/* ✅ Traduit */}
                </p>
                <p className="text-sm opacity-70">
                    {t('brands.products.try_other_keywords')} {/* ✅ Traduit */}
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <SortBar
                count={filteredByText.length}
                sort={sort}
                setSort={setSort}
                view={view}
                setView={setView}
            />

            {view === "grid" ? (
                canManageProducts && onAddProduct ? (
                    // Mode gestion : grille manuelle avec AddProductCard
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        <AddProductCard onClick={onAddProduct} />
                        {filteredByText.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                liked={likedMap[p.id] ?? false}
                                onToggleLike={() => toggleLike(p.id)}
                                showStatus={canManageProducts}
                                editMode={canManageProducts}
                            />
                        ))}
                    </div>
                ) : (
                    // Mode normal : utiliser ProductGrid
                    <ProductGrid
                        items={filteredByText}
                        likedMap={likedMap}
                        toggleLike={toggleLike}
                    />
                )
            ) : (
                <>
                    {/* En mode liste, carte d'ajout avant la liste */}
                    {canManageProducts && onAddProduct && (
                        <div className="mb-6">
                            <AddProductCard onClick={onAddProduct} />
                        </div>
                    )}
                    <ProductList
                        items={filteredByText}
                        likedMap={likedMap}
                        toggleLike={toggleLike}
                    />
                </>
            )}
        </section>
    );
};