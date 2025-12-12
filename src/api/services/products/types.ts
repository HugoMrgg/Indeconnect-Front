import { Color } from "@/types/Product";

// DTO qui correspond à ce que le backend envoie dans la liste de produits
export interface ProductDTO {
    id: number;
    name: string;
    price: number;
    primaryImageUrl: string | null;
    description: string;
    averageRating?: number;
    reviewCount?: number;
    primaryColor?: Color | null;
    category?: string;
}

export interface ProductsResponse {
    products: ProductDTO[];
    totalCount: number;
    page: number;
    pageSize: number;
}

// Type pour les variantes de taille
export interface SizeVariantResponse {
    id: number;
    sku: string;
    size: {
        id: number;
        name: string;
    } | null;
    stockCount: number;
    price: number;
    isAvailable: boolean;
}

// Type pour les variantes de couleur
export interface ColorVariantResponse {
    productId: number;
    colorId: number | null;
    colorName: string | null;
    colorHexa: string | null;
    thumbnailUrl: string | null;
    isAvailable: boolean;
}

// Type pour le stock
export interface ProductStockResponse {
    productId: number;
    totalStock: number;
    isAvailable: boolean;
    variants: Array<{
        variantId: number;
        size: string | null;
        stockCount: number;
    }>;
}

// Type pour les avis
export interface ProductReviewsResponse {
    reviews: Array<{
        id: number;
        userId: number;
        userName: string;
        rating: number;
        comment: string;
        createdAt: string;
        status: string;
    }>;
    totalCount: number;
    page: number;
    pageSize: number;
    averageRating: number;
}

// Type d'envoie pour les créations
export interface CreateProductPayload {
    name: string;
    description: string;
    price: number;
    brandId: number;
    categoryId: number;
    primaryColorId: number | null;
    media: unknown[];
    sizeVariants: unknown[];
    details: unknown[];
    keywords: string[];
    status?: "Draft" | "Published" | "Archived";
}

// Type de réponse pour les créations
export interface CreateProductResponse {
    id: number;
    name: string;
    brandId: number;
    categoryId: number;
    status: string;
    createdAt: string;
}
