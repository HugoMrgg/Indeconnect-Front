export interface Color {
    id: number;
    name: string;
    hexa: string;
}

export interface Size {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

// Type pour le listing de produits (ProductSummaryDto backend)
export interface Product {
    id: number;
    name: string;
    price: number;
    primaryImageUrl: string | null;
    description: string;
    averageRating: number;
    reviewCount: number;
    primaryColor: Color | null;
    status?: "Draft" | "Online" | "Offline";

    // Pour compatibilité avec ton code existant
    brand: string;
    category?: string;
    image?: string;
    sizes?: string[];
    tags?: string[];
    color?: string;
    ethics?: string[];
}

// Type détaillé pour la page produit
export interface ProductDetail {
    id: number;
    name: string;
    description: string;
    price: number;
    salePrice: number | null;
    brand: {
        id: number;
        name: string;
        logoUrl: string | null;
    };
    category: Category;
    primaryColor: Color | null;
    colorVariants: ColorVariant[];
    media: ProductMedia[];
    sizeVariants: SizeVariant[];
    details: ProductDetailItem[];
    keywords: string[];
    reviews: ProductReview[];
    averageRating: number;
    reviewCount: number;
    totalStock: number;
    isAvailable: boolean;
    status: string;
    createdAt: string;
}

export interface ColorVariant {
    productId: number;
    colorId: number | null;
    colorName: string | null;
    colorHexa: string | null;
    thumbnailUrl: string | null;
    isAvailable: boolean;
}

export interface ProductMedia {
    id: number;
    url: string;
    type: string;
    displayOrder: number;
    isPrimary: boolean;
}

export interface SizeVariant {
    id: number;
    sku: string;
    size: Size | null;
    stockCount: number;
    price: number;
    isAvailable: boolean;
}

export interface ProductDetailItem {
    key: string;
    value: string;
    displayOrder: number;
}

export interface ProductReview {
    id: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    status: string;
}
