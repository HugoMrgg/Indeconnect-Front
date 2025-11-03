import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { fetchProductsByBrand } from "@/api/productsApi";

export function useProducts(brandName: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchProductsByBrand(brandName);
                setProducts(data);
            } catch (err) {
                setError("Erreur lors du chargement des produits");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [brandName]);

    return { products, loading, error };
}
