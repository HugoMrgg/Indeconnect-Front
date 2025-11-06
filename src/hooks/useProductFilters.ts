import { useMemo, useState } from "react";
import { Product } from "@/types/Product";

export function useProductFilters(products: Product[]) {
    const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc">("featured");
    const [view, setView] = useState<"grid" | "list">("grid");

    const [price, setPrice] = useState<{ min: string; max: string }>({ min: "", max: "" });
    const [categories, setCategories] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);

    const [resetKey, setResetKey] = useState(0);

    const resetAll = () => {
        setPrice({ min: "", max: "" });
        setCategories([]);
        setSizes([]);
        setResetKey((n) => n + 1);
    };

    const handlePrice = (min: string, max: string) => setPrice({ min, max });

    const handleCategories = (cat: string, checked: boolean) =>
        setCategories((prev) => (checked ? [...prev, cat] : prev.filter((c) => c !== cat)));

    const handleSizes = (size: string) =>
        setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));

    const filtered = useMemo(() => {
        let list = products.slice();

        if (price.min) list = list.filter((p) => p.price >= Number(price.min));
        if (price.max) list = list.filter((p) => p.price <= Number(price.max));

        if (categories.length > 0) {
            list = list.filter((p) => p.category && categories.includes(p.category));
        }

        if (sizes.length > 0) {
            list = list.filter((p) => (p.sizes || []).some((s) => sizes.includes(s)));
        }

        if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
        if (sort === "price_desc") list.sort((a, b) => b.price - a.price);

        return list;
    }, [products, price, categories, sizes, sort]);

    return {
        // states
        sort,
        view,
        price,
        categories,
        sizes,
        resetKey,

        // setters
        setSort,
        setView,
        handlePrice,
        handleCategories,
        handleSizes,
        resetAll,

        // output filtered list
        filtered,
    };
}
