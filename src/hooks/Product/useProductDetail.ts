import { useEffect, useState } from "react";
import {
    fetchProductById,
    fetchProductVariants,
    fetchProductColorVariants,
} from "@/api/services/products";
import {
    ProductDetail,
    ColorVariant,
    SizeVariant,
} from "@/types/Product";

interface UseProductDetailReturn {
    product: ProductDetail | null;
    colorVariants: ColorVariant[];
    sizeVariants: SizeVariant[];
    loading: boolean;
    error: string | null;
}

/**
 * Hook pour charger les détails complets d'un produit
 * Encapsule les appels API pour product, variants de couleur et variants de taille
 */
export function useProductDetail(productId: number): UseProductDetailReturn {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
    const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                // Charger toutes les données en parallèle
                const [prod, colors, sizes] = await Promise.all([
                    fetchProductById(productId),
                    fetchProductColorVariants(productId),
                    fetchProductVariants(productId),
                ]);

                setProduct(prod);
                setColorVariants(colors);
                setSizeVariants(sizes);
            } catch (err) {
                console.error("Error loading product details:", err);
                setError(err instanceof Error ? err.message : "Erreur lors du chargement du produit");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [productId]);

    return {
        product,
        colorVariants,
        sizeVariants,
        loading,
        error,
    };
}
