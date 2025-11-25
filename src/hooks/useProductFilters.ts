import {useMemo, useState} from "react";
import { Product } from "@/types/Product";

export function useProductFilters(products: Product[]) {
    // --- États principaux ---
    const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc">("featured");
    const [view, setView] = useState<"grid" | "list">("grid");

    const [price, setPrice] = useState<{ min: string; max: string }>({ min: "", max: "" });
    const [categories, setCategories] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [ethics, setEthics] = useState<string[]>([]);

    const [resetKey, setResetKey] = useState(0);

    // --- Reset global ---
    const resetAll = () => {
        setPrice({ min: "", max: "" });
        setCategories([]);
        setSizes([]);
        setColors([]);
        setEthics([]);
        setResetKey((prev) => prev + 1);
    };

    // --- Extraction des couleurs disponibles ---
    const availableColors = useMemo(() => {
        const set = new Set<string>();
        products.forEach((p) => {
            if (p.color) set.add(p.color.toLowerCase());
        });
        return Array.from(set);
    }, [products]);

    // --- Extraction des labels éthiques disponibles ---
    const availableEthics = useMemo(() => {
        const set = new Set<string>();
        products.forEach((p) => {
            (p.ethics ?? []).forEach((e) => {
                if (e) set.add(e);
            });
        });
        return Array.from(set);
    }, [products]);

    // --- Handlers ---
    const handlePrice = (min: string, max: string) => setPrice({ min, max });

    const handleCategories = (cat: string, checked: boolean) =>
        setCategories((prev) =>
            checked ? [...prev, cat] : prev.filter((c) => c !== cat)
        );

    const handleSizes = (size: string) =>
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );

    const handleColors = (color: string) =>
        setColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );

    const handleEthics = (label: string, checked: boolean) =>
        setEthics((prev) =>
            checked ? [...prev, label] : prev.filter((e) => e !== label)
        );

    // --- Filtrage dynamique ---
    const filtered = useMemo(() => {
        let list = [...products];

        // Filtres prix
        if (price.min) list = list.filter((p) => p.price >= Number(price.min));
        if (price.max) list = list.filter((p) => p.price <= Number(price.max));

        // Catégories
        if (categories.length > 0)
            list = list.filter(
                (p) => p.category && categories.includes(p.category)
            );

        // Tailles
        if (sizes.length > 0)
            list = list.filter(
                (p) => (p.sizes ?? []).some((s) => sizes.includes(s))
            );

        // Couleurs
        if (colors.length > 0)
            list = list.filter(
                (p) => p.color && colors.includes(p.color.toLowerCase())
            );

        // Éthique
        if (ethics.length > 0)
            list = list.filter(
                (p) => (p.ethics ?? []).some((e) => ethics.includes(e))
            );

        // Tri
        if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
        if (sort === "price_desc") list.sort((a, b) => b.price - a.price);

        return list;
    }, [products, price, categories, sizes, colors, ethics, sort]);

    return {
        // états
        sort, setSort,
        view, setView,
        price,
        categories,
        sizes,
        colors,
        ethics,
        resetKey,

        // handlers
        handlePrice,
        handleCategories,
        handleSizes,
        handleColors,
        handleEthics,
        resetAll,

        // données filtrables
        availableColors,
        availableEthics,

        // résultat final
        filtered,

        // cohérence API pour BrandProducts
        loading: false,
    };
}
