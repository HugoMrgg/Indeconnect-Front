import { useQueries } from "@tanstack/react-query";
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
    const results = useQueries({
        queries: [
            {
                queryKey: ['product', productId],
                queryFn: () => fetchProductById(productId),
                staleTime: 5 * 60 * 1000, // 5 min (données produit changent peu)
            },
            {
                queryKey: ['product-color-variants', productId],
                queryFn: () => fetchProductColorVariants(productId),
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: ['product-size-variants', productId],
                queryFn: () => fetchProductVariants(productId),
                staleTime: 5 * 60 * 1000,
            },
        ],
    });

    const [productQuery, colorVariantsQuery, sizeVariantsQuery] = results;

    const loading = results.some((q) => q.isLoading);
    const error = results.find((q) => q.error)?.error;

    return {
        product: productQuery.data ?? null,
        colorVariants: colorVariantsQuery.data ?? [],
        sizeVariants: sizeVariantsQuery.data ?? [],
        loading,
        error: error ? "Erreur lors du chargement du produit" : null,
    };
}
