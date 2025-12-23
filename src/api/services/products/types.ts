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