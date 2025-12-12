export interface Brand {
    id: number;
    name: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    description?: string | null;
    ethicsScoreProduction: number;
    ethicsScoreTransport: number;
    address?: string | null;
    distanceKm?: number | null;
    userRating: number;

    aboutUs?: string | null;
    whereAreWe?: string | null;
    otherInfo?: string | null;
    contact?: string | null;
    priceRange?: string | null;
    accentColor?: string | null;
    mainCity?: string | null;
}
export type EditableBrandFields = Pick<Brand,
    | "name"
    | "logoUrl"
    | "bannerUrl"
    | "description"
    | "aboutUs"
    | "whereAreWe"
    | "otherInfo"
    | "contact"
    | "priceRange"
    | "accentColor"
    | "address"
>;