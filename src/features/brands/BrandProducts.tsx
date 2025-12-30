import React, {useMemo} from "react";

import { userStorage } from "@/storage/UserStorage";
import { Product } from "@/types/Product";
import { useWishlistUI } from "@/hooks/User/useWishlistUI";

import SortBar from "@/features/sorting/SortBar";
import { ProductGrid } from "@/features/brands/ProductGrid";
import { ProductList } from "@/features/brands/ProductList";
import { AddProductCard } from "@/features/product/AddProductCard";
import ProductCard from "@/components/cards/ProductCard";

/* Typage du filtre */
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
    editMode?: boolean;
    onAddProduct?: () => void;
}

export const BrandProducts: React.FC<Props> = ({
                                                   filter,
                                                   searchQuery,
                                                   editMode = false,
                                                   onAddProduct
                                               }) => {
    const { filtered, sort, setSort, view, setView } = filter;

    const user = userStorage.getUser();

    /** Filtrage par texte */
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

    // Gestion de la wishlist via le hook dédié
    const { likedMap, toggleLike } = useWishlistUI(user?.id, filteredByText);

    // Cas spécial : mode édition sans produits
    if (editMode && filteredByText.length === 0 && onAddProduct) {
        return (
            <section className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                    <p className="text-lg font-medium mb-2">Aucun produit pour le moment</p>
                    <p className="text-sm">Commencez par ajouter votre premier produit !</p>
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
                <p className="text-lg">Votre recherche n'a rien donné...</p>
                <p className="text-sm opacity-70">Essayez d'autres mots-clés</p>
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
                editMode && onAddProduct ? (
                    // Mode édition : grille manuelle avec AddProductCard
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        <AddProductCard onClick={onAddProduct} />
                        {filteredByText.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                liked={likedMap[p.id] ?? false}
                                onToggleLike={() => toggleLike(p.id)}
                                showStatus={editMode}
                                editMode={editMode}
                            />
                        ))}
                    </div>
                ) : (
                    // Mode normal : utiliser ProductGrid comme avant
                    <ProductGrid
                        items={filteredByText}
                        likedMap={likedMap}
                        toggleLike={toggleLike}
                    />
                )
            ) : (
                <>
                    {/* En mode liste, on affiche la carte d'ajout avant la liste */}
                    {editMode && onAddProduct && (
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