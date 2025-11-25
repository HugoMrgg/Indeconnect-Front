import axiosInstance from "@/api/api";
import { Product, ProductDetail } from "@/types/Product";
import { PRODUCTS_ROUTES } from "./routes";
import { ProductsResponse } from "@/api/services/products/types";


/**
 * Mapper le DTO backend vers le type Product frontend
 */
function mapProductDTO(dto: any, brandName: string): Product {
    return {
        id: dto.id,
        name: dto.name,
        price: dto.price,
        primaryImageUrl: dto.primaryImageUrl,
        description: dto.description,
        averageRating: dto.averageRating || 0,
        reviewCount: dto.reviewCount || 0,
        primaryColor: dto.primaryColor,

        // Compatibilité avec ancien code
        brand: brandName,
        category: dto.category || undefined,
        image: dto.primaryImageUrl || undefined,
        sizes: [],
        tags: [],
        color: dto.primaryColor?.name?.toLowerCase() || undefined,
        ethics: [],
    };
}

/**
 * Récupère tous les produits d'une marque
 */
export async function fetchProductsByBrand(
    brandId: number,
    brandName: string,
    params?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        searchTerm?: string;
        sortBy?: "PriceAsc" | "PriceDesc" | "Rating" | "Popular" | "Newest";
        page?: number;
        pageSize?: number;
    }
): Promise<Product[]> {
    try {
        const response = await axiosInstance.get<ProductsResponse>(
            PRODUCTS_ROUTES.byBrand(brandId),
            {
                params: {
                    Category: params?.category,
                    MinPrice: params?.minPrice,
                    MaxPrice: params?.maxPrice,
                    SearchTerm: params?.searchTerm,
                    SortBy: params?.sortBy,
                    Page: params?.page || 1,
                    PageSize: params?.pageSize || 100,
                }
            }
        );

        return response.data.products.map(p => mapProductDTO(p, brandName));
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

/**
 * Récupère le détail d'un produit
 */
export async function fetchProductById(productId: number): Promise<ProductDetail> {
    try {
        const response = await axiosInstance.get<ProductDetail>(PRODUCTS_ROUTES.byId(productId));
        return response.data;
    } catch (error) {
        console.error("Error fetching product detail:", error);
        throw error;
    }
}

/**
 * Récupère les variantes de taille d'un produit
 */
export async function fetchProductVariants(productId: number) {
    try {
        const response = await axiosInstance.get(PRODUCTS_ROUTES.variants(productId));
        return response.data;
    } catch (error) {
        console.error("Error fetching product variants:", error);
        throw error;
    }
}

/**
 * Récupère les variantes de couleur d'un produit (autres produits du même groupe)
 */
export async function fetchProductColorVariants(productId: number) {
    try {
        const response = await axiosInstance.get(PRODUCTS_ROUTES.variants(productId));
        return response.data;
    } catch (error) {
        console.error("Error fetching color variants:", error);
        throw error;
    }
}

/**
 * Récupère le stock d'un produit
 */
export async function fetchProductStock(productId: number) {
    try {
        const response = await axiosInstance.get(PRODUCTS_ROUTES.stock(productId));
        return response.data;
    } catch (error) {
        console.error("Error fetching product stock:", error);
        throw error;
    }
}

/**
 * Récupère les avis d'un produit
 */
export async function fetchProductReviews(productId: number, page = 1, pageSize = 20) {
    try {
        const response = await axiosInstance.get(PRODUCTS_ROUTES.reviews(productId), {
            params: { page, pageSize }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        throw error;
    }
}
