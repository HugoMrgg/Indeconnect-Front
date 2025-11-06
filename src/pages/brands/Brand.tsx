 import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BannerBrand } from "@/features/banners/BannerBrand";
import SidebarFilters from "@/features/filters/SidebarFilters";
import SortBar from "@/features/sorting/SortBar";
import ProductCard from "@/components/cards/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import {NavBar} from "@/features/navbar/NavBar";
import {useBrands} from "@/hooks/useBrands";
import {Heart, IdCard, Loader2, MapPin, Truck} from "lucide-react";
 import {FiltersPanel} from "@/features/filters/FiltersPanel";

export const BrandPage: React.FC = () => {
    const { brandName } = useParams();
    const decodedBrand = decodeURIComponent(brandName ?? "");
    const { products, loading, error } = useProducts(decodedBrand);
    const {brandsNearby, ethicalBrands} = useBrands();
    const allBrands = [...brandsNearby, ...ethicalBrands];
    const brand = allBrands.find(b => b.name === decodedBrand);

    // --- Ouverture panneau filtres ---
    const [filtersOpen, setFiltersOpen] = useState(false);

    // --- Réinitialiser les filtres ---
    const [resetKey, setResetKey] = useState(0);

    const resetFilters = () => {
        setPrice({ min: "", max: "" });
        setCategories([]);
        setSizes([]);
        setResetKey(prev => prev + 1); // ✅ déclenche reset
    };



    // --- s'abonner à une marque
    const [subscribed, setSubscribed] = useState(false);

    // --- États filtres ---
    const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc">("featured");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [price, setPrice] = useState<{ min: string; max: string }>({ min: "", max: "" });
    const [categories, setCategories] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);

    // --- Gestion des filtres ---
    const handlePrice = (min: string, max: string) => setPrice({ min, max });

    const handleCategories = (cat: string, checked: boolean) =>
        setCategories((prev) =>
            checked ? [...prev, cat] : prev.filter((c) => c !== cat)
        );

    const handleSizes = (size: string) =>
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );

    // --- Filtrage dynamique ---
    const items = useMemo(() => {
        let list = products.slice();

        // Filtres prix
        if (price.min) list = list.filter((p) => p.price >= Number(price.min));
        if (price.max) list = list.filter((p) => p.price <= Number(price.max));

        // Filtres catégorie
        if (categories.length > 0) {
            list = list.filter(
                (p) => p.category && categories.includes(p.category)
            );
        }

        // Filtres tailles
        if (sizes.length > 0) {
            list = list.filter(
                (p) => (p.sizes || []).some((s) => sizes.includes(s))
            );
        }

        // Tri
        if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
        if (sort === "price_desc") list.sort((a, b) => b.price - a.price);

        return list;
    }, [products, price, categories, sizes, sort]);

    // --- États de chargement / erreur ---
    if (loading) {
        return (
            <div className="min-h-full bg-white">
                <BannerBrand name={decodedBrand}/>
                <main className="mx-auto max-w-6xl px-4 pb-16">
                    <p className="text-gray-500 animate-pulse">
                        Chargement de la page des produits de {decodedBrand}...
                    </p>
                </main>
                <NavBar scope="products"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full bg-white">
                <BannerBrand name={decodedBrand}/>
                <main className="mx-auto max-w-6xl px-4 pb-16">
                    <p className="text-red-600">{error}</p>
                </main>
                <NavBar scope="products" />
            </div>
        );
    }

    // --- Affichage principal ---
    return (
    <div className="min-h-full bg-white">
        <BannerBrand name={decodedBrand} />

        <main className="mx-auto max-w-6xl px-4 pb-16">
            <div className="flex justify-between my-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{brand?.name}</h1>

                    <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
                        {brand?.description}
                    </p>

                    <div className="flex gap-2">
                        <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            <MapPin size={16} />
                            {brand?.city}
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            <Truck size={16} />
                            {brand?.transport}
                        </div>

                        {/*mb mettre une boucle ici pour le reste des mots clés*/}
                    </div>

                </div>

                <div className="flex flex-col gap-3 text-base">
                    <button
                        onClick={() => setSubscribed(!subscribed)}
                        className={`inline-flex content-between w-40 gap-3 px-3 py-2 rounded-xl transition hover:bg-gray-100 active:scale-[0.97]`}
                    >
                        <Heart className={`w-6 h-6 transition-all duration-300
                                        ${subscribed ? "text-red-500 scale-110" : "text-gray-700"}`}
                            fill={subscribed ? "currentColor" : "none"}
                        />
                        <span className="text-gray-800">
                          {subscribed ? "Abonné ✓" : "S'abonner"}
                        </span>
                    </button>

                    <button
                        className="inline-flex content-between w-40 gap-3 px-3 py-2 rounded-xl transition hover:bg-gray-100 active:scale-[0.97]"
                    >
                        <IdCard className="w-6 h-6 text-gray-700" />
                        <span className="text-gray-800">Contact</span>
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <Link
                    to="/"
                    className="text-blue-600 hover:underline font-medium text-sm"
                >
                    ← Retour aux marques
                </Link>
            </div>

            {/* --- PANNEAU FILTRES --- */}
            <FiltersPanel
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                onReset={resetFilters}
                resetKey={resetKey}
                onChangePrice={handlePrice}
                onChangeCategories={handleCategories}
                onChangeSizes={handleSizes}
                selectedCategories={categories}
                selectedSizes={sizes}
            />



            <section className="space-y-4">
                <SortBar
                    count={loading ? 0 : items.length}
                    sort={sort}
                    setSort={setSort}
                    view={view}
                    setView={setView}
                />

                {/* --- Chargement Skeleton --- */}
                {loading ? (
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Chargement des produits...</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col rounded-2xl border border-gray-200 bg-gray-100 animate-pulse"
                                >
                                    <div className="aspect-[4/5] bg-gray-200 rounded-t-2xl" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        <div className="h-5 bg-gray-300 rounded w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : view === "grid" ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {items.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center gap-4 rounded-xl border p-3"
                            >
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="h-20 w-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-sm text-gray-600">
                                        € {p.price.toFixed(2)}
                                    </div>
                                </div>
                                <button className="rounded-lg border px-3 py-2 text-sm">
                                    Voir
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>

        <NavBar scope="products" onToggleFilters={() => setFiltersOpen(prev => !prev)} />

    </div>
    );
};
