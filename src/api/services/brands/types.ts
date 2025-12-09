// Enum pour le tri (correspond à EthicsSortType C#)
export enum EthicsSortType {
    MaterialsManufacturing = "MaterialsManufacturing",
    Transport = "Transport",
    Distance = "Distance",
    Note = "Note"
}

// DTO d'un dépôt/point de vente
export interface DepositDTO {
    id: string;
    fullAddress: string;
    distanceKm: number | null;
}

// DTO résumé d'une marque (pour la liste)
export interface BrandSummaryDTO {
    id: number;
    name: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    description: string | null;
    ethicsScoreProduction: number;
    ethicsScoreTransport: number;
    ethicTags: string[];
    address: string | null;
    distanceKm: number | null;
    userRating: number;
}

// Réponse de la liste de marques
export interface BrandsListResponse {
    brands: BrandSummaryDTO[];
    totalCount: number;
    page: number;
    pageSize: number;
    locationUsed: boolean;
}

// DTO détaillé d'une marque
export interface BrandDetailDTO {
    id: number;
    name: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    description: string | null;
    aboutUs: string | null;
    whereAreWe: string | null;
    otherInfo: string | null;
    contact: string | null;
    priceRange: string | null;
    averageUserRating: number;
    reviewsCount: number;
    ethicTags: string[];
    deposits: DepositDTO[];
    ethicsScore: number;
    ethicsScoreProduction: number;
    ethicsScoreTransport: number;
    address: string | null;
    distanceKm: number | null;
    accentColor: string | null;
}

// Paramètres de requête pour getBrands
export interface BrandsQueryParams {
    sortBy?: EthicsSortType;
    lat?: number;
    lon?: number;
    page?: number;
    pageSize?: number;
    priceRange?: string;
    userRatingMin?: number;
    maxDistanceKm?: number;
    minEthicsProduction?: number;
    minEthicsTransport?: number;
    ethicTags?: string[];
}

// DTO pour un tag éthique
export interface EthicTagDTO {
    key: string;
    label: string;
    description: string | null;
    brandCount: number;
}

// Réponse de la liste des tags éthiques
export interface EthicTagsListResponse {
    tags: EthicTagDTO[];
}

export interface UpdateBrandRequest {
    name: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    description: string | null;
    aboutUs: string | null;
    whereAreWe: string | null;
    otherInfo: string | null;
    contact: string | null;
    priceRange: string | null;
    accentColor: string | null;
}
