export interface Brand {
    id: number;
    name: string;
    logoUrl?: string;
    bannerUrl?: string;
    description?: string;
    ethicsScoreProduction: number;
    ethicsScoreTransport: number;
    address?: string;
    distanceKm?: number;
    userRating: number;
}
