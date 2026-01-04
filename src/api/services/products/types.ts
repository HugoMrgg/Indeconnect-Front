import { Color } from "@/types/Product";

// ← Importer le type Sale
export interface Sale {
    id: number;
    name: string;
    description: string | null;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

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
    status?: "Draft" | "Online" | "Offline";
    sale?: Sale | null;
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

// --- AJOUTE CECI AU DÉBUT DU FICHIER ---

// 1. On définit ce qu'est un "Avis" unique (DTO)
export interface ProductReviewDTO {
    id: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string; // C'est une string car JSON renvoie des dates en string
    status: string;
}

// 2. On définit ce qu'on envoie pour CRÉER un avis
export interface CreateProductReviewDTO {
    rating: number;
    comment: string;
}

// --- MODIFIE L'EXISTANT COMME CECI ---

// Type pour la réponse (liste d'avis)
export interface ProductReviewsResponse {
    // Ici, on réutilise le type qu'on vient de créer au-dessus
    reviews: ProductReviewDTO[];
    totalCount: number;
    page: number;
    pageSize: number;
    averageRating: number;
}

export interface CreateProductGroupRequest {
    name: string;
    baseDescription: string;
    categoryId: number;
}

export interface ProductGroupDto {
    id: number;
    name: string;
    baseDescription: string;
    categoryId: number;
    brandId: number;
    createdAt: string;
}

export interface ProductGroupSummaryDto {
    id: number;
    name: string;
    baseDescription: string;
    categoryId: number;
    categoryName: string;
    productCount: number;
}

export interface ProductGroupsResponse {
    groups: ProductGroupSummaryDto[];
    totalCount: number;
}

export interface SizeDto {
    id: number;
    name: string;
}

export interface CreateVariantDto {
    sku: string;
    size: SizeDto | null;
    stockCount: number;
    price: number;
    isAvailable: boolean;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    brandId: number;
    categoryId: number;
    productGroupId: number;
    primaryColorId: number | null;
    media: Array<{
        url: string;
        type: "Image" | "Video";
        displayOrder: number;
        isPrimary: boolean;
    }>;
    sizeVariants: CreateVariantDto[];
    details: Array<{
        value: string;
        displayOrder: number;
    }>;
    keywords: string[];
    status: "Draft" | "Online" | "Offline";
}

export interface CreateProductResponse {
    id: number;
    name: string;
    brandName: string;
    categoryName: string;
    price: number;
    status: string;
    createdAt: string;
}
// Types pour la mise à jour d'un produit
export interface UpdateProductRequest {
    name: string;
    description: string;
    price: number;
    status: "Draft" | "Active" | "Online" | "Disabled";
    primaryColorId: number | null;
    categoryId: number;
    sale: {
        discountPercentage: number;
        startDate: string;
        endDate: string;
        description?: string;
    } | null;
    variants: Array<{
        sizeId: number;
        stockCount: number;
        id?: number; // Si id existe, c'est une mise à jour, sinon c'est une création
    }>;
    media: Array<{
        url: string;
        type: "Image" | "Video";
        displayOrder: number;
        isPrimary: boolean;
    }>;
}

export interface UpdateProductResponse {
    id: number;
    name: string;
    status: string;
    updatedAt: string;
}
