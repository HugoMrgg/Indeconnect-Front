import axiosInstance from "@/api/api";
import { Product, ProductDetail } from "@/types/Product";
import { PRODUCTS_ROUTES } from "./routes";
import { logger } from "@/utils/logger";
import {
    ProductsResponse,
    ProductDTO,
    SizeVariantResponse,
    ColorVariantResponse,
    ProductStockResponse,
    ProductReviewsResponse,
    CreateProductRequest,
    CreateProductResponse,
    CreateProductGroupRequest,
    ProductGroupDto,
    ProductGroupSummaryDto,
    ProductReviewDTO,
    CreateProductReviewDTO,
    UpdateProductRequest,
    UpdateProductResponse,
} from "@/api/services/products/types";

/**
 * Mapper le DTO backend vers le type Product frontend
 */
function mapProductDTO(dto: ProductDTO, brandName: string): Product {
    return {
        id: dto.id,
        name: dto.name,
        price: dto.price,
        primaryImageUrl: dto.primaryImageUrl,
        description: dto.description,
        averageRating: dto.averageRating || 0,
        reviewCount: dto.reviewCount || 0,
        primaryColor: dto.primaryColor || null,
        status: dto.status,
        sale: dto.sale || undefined,

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
        logger.error("ProductsService.fetchProductsByBrand", error);
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
        logger.error("ProductsService.fetchProductById", error);
        throw error;
    }
}

/**
 * Récupère les variantes de taille d'un produit
 */
export async function fetchProductVariants(productId: number): Promise<SizeVariantResponse[]> {
    try {
        const response = await axiosInstance.get<SizeVariantResponse[]>(
            PRODUCTS_ROUTES.variants(productId)
        );
        return response.data;
    } catch (error) {
        logger.error("ProductsService.fetchProductVariants", error);
        throw error;
    }
}

/**
 * Récupère les variantes de couleur d'un produit (autres produits du même groupe)
 */
export async function fetchProductColorVariants(productId: number): Promise<ColorVariantResponse[]> {
    try {
        const response = await axiosInstance.get<ColorVariantResponse[]>(
            PRODUCTS_ROUTES.colors(productId)
        );
        return response.data;
    } catch (error) {
        logger.error("ProductsService.fetchProductColorVariants", error);
        throw error;
    }
}

/**
 * Récupère le stock d'un produit
 */
export async function fetchProductStock(productId: number): Promise<ProductStockResponse> {
    try {
        const response = await axiosInstance.get<ProductStockResponse>(
            PRODUCTS_ROUTES.stock(productId)
        );
        return response.data;
    } catch (error) {
        logger.error("ProductsService.fetchProductStock", error);
        throw error;
    }
}

/**
 * Récupère les avis d'un produit
 */
export async function fetchProductReviews(
    productId: number,
    page = 1,
    pageSize = 20
): Promise<ProductReviewsResponse> {
    try {
        const response = await axiosInstance.get<ProductReviewDTO[]>(
            PRODUCTS_ROUTES.reviews(productId),
            {
                params: { page, pageSize }
            }
        );

        return {
            reviews: response.data, // On met le tableau reçu ici
            totalCount: response.data.length,
            page: page,
            pageSize: pageSize,
            averageRating: 0 // On pourra le calculer si besoin, ou le laisser à 0 pour l'instant
        };

    } catch (error) {
        logger.error("ProductsService.fetchProductReviews", error);
        return {
            reviews: [],
            totalCount: 0,
            page: 1,
            pageSize: pageSize,
            averageRating: 0
        };
    }
}

/**
 * Crée un nouvel avis
 */
export async function createProductReview(
    productId: number,
    payload: CreateProductReviewDTO
): Promise<ProductReviewDTO> {
    try {
        const response = await axiosInstance.post<ProductReviewDTO>(
            PRODUCTS_ROUTES.reviews(productId),
            payload
        );
        return response.data;
    } catch (error) {
        logger.error("ProductsService.createProductReview", error);
        throw error;
    }
}

/**
 * Créer un nouveau produit
 */
export async function createProduct(data: CreateProductRequest): Promise<CreateProductResponse> {
    try {
        const response = await axiosInstance.post<CreateProductResponse>(
            PRODUCTS_ROUTES.create(),
            data
        );
        return response.data;
    } catch (error) {
        logger.error("ProductsService.createProduct", error);
        throw error;
    }
}

/**
 * Créer un nouveau product group
 */
export async function createProductGroup(data: CreateProductGroupRequest): Promise<ProductGroupDto> {
    try {
        const response = await axiosInstance.post<ProductGroupDto>(
            PRODUCTS_ROUTES.createGroup(),
            data
        );
        return response.data;
    } catch (error) {
        logger.error("ProductsService.createProductGroup", error);
        throw error;
    }
}

export async function fetchProductGroupsByBrand(brandId: number): Promise<ProductGroupSummaryDto[]> {
    try {
        const response = await axiosInstance.get<ProductGroupSummaryDto[]>(
            PRODUCTS_ROUTES.groupsByBrand(brandId)
        );
        return response.data;
    } catch (error) {
        logger.error("ProductsService.fetchProductGroupsByBrand", error);
        throw error;
    }
}
/**
 * Vérifie si l'utilisateur connecté a le droit de noter ce produit
 */
export async function checkCanUserReview(productId: number): Promise<boolean> {
    try {
        const url = PRODUCTS_ROUTES.canReview(productId);

        const response = await axiosInstance.get<boolean>(url);

        return response.data;
    } catch (error) {
        logger.error("ProductsService.checkCanUserReview", error);
        return false;
    }
}


/**
 * Désactive un avis d'un produit
 */
export async function disableProductReview(reviewId: number): Promise<void> {
    await axiosInstance.post(
        PRODUCTS_ROUTES.disableReview(reviewId)
    );
}

/**
 * Met à jour un produit existant (SuperVendor uniquement)
 */
export async function updateProduct(
    productId: number,
    data: UpdateProductRequest
): Promise<UpdateProductResponse> {
    try {
        const response = await axiosInstance.put<UpdateProductResponse>(
            PRODUCTS_ROUTES.update(productId),
            data
        );
        return response.data;
    } catch (error) {
        logger.error("ProductsService.updateProduct", error);
        throw error;
    }
}