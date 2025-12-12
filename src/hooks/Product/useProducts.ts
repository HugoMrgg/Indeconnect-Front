import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { fetchProductsByBrand } from "@/api/services/products";

export function useProducts(brandId: number | null, brandName: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!brandId) {
            setLoading(false);
            setProducts([]);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchProductsByBrand(brandId, brandName);
                setProducts(data);
            } catch (err) {
                console.error("Error loading products:", err);
                setError("Erreur lors du chargement des produits");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [brandId, brandName]);

    return { products, loading, error };
}
