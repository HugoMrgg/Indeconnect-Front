import { Brand } from "@/types/brand";

export interface BrandsResponse {
    nearby: Brand[];
    ethical: Brand[];
}

// Simulation d’une requête API avec un délai
export async function fetchBrands(): Promise<BrandsResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                nearby: [
                    {
                        name: "6K Skateshop",
                        city: "Liège",
                        description:
                            "Magasin liégeois rue de la Casquette, connu pour ses vêtements streetwear et sa marque indépendante Lucid.",
                        distance_km: 2,
                        rating: 2.8,
                        ethical_prod: 3.6,
                        ethical_transports: 4,
                        transport: "BPost (BE)",
                        logo_url: "../logos/6k_logo.jpg",
                    },
                    {
                        name: "Zéden Atelier",
                        city: "Liège",
                        description:
                            "Création textile & upcycling liègeois",
                        distance_km: 5,
                        rating: 5,
                        ethical_prod: 5,
                        ethical_transports: 4,
                        transport: "BPost (BE)",
                        logo_url: "/logos/6k_logo.jpg",
                    },
                    {
                        name: "Dyl",
                        city: "Liège",
                        description:
                            "Design your life",
                        distance_km: 8,
                        rating: 4.2,
                        ethical_prod: 4,
                        ethical_transports: 4.4,
                        transport: "BPost (BE)",
                        logo_url: "/logos/6k_logo.jpg",
                    },
                    {
                        name: "Namur Style",
                        city: "Namur",
                        description:
                            "Une marque locale qui met à l’honneur les créateurs de la région namuroise.",
                        distance_km: 60,
                        rating: 4.5,
                        ethical_prod: 4.5,
                        ethical_transports: 3.8,
                        transport: "BPost (BE)",
                        logo_url: "/logos/6k_logo.jpg",
                    },
                    {
                        name: "Namur Style",
                        city: "Namur",
                        description:
                            "Une marque locale qui met à l’honneur les créateurs de la région namuroise.",
                        distance_km: 60,
                        rating: 4.5,
                        ethical_prod: 4.5,
                        ethical_transports: 3.8,
                        transport: "BPost (BE)",
                        logo_url: "/logos/6k_logo.jpg",
                    },
                ],
                ethical: [
                    {
                        name: "EcoWear",
                        city: "Bruxelles",
                        description: "Mode durable et éthique fabriquée en Europe.",
                        distance_km: 112,
                        rating: 3.8,
                        ethical_prod: 4.9,
                        ethical_transports: 3.5,
                        transport: "BPost (BE)",
                        logo_url: "/logos/6k_logo.jpg",
                    },
                    {
                        name: "TerraNova",
                        city: "Gand",
                        description:
                            "Des vêtements éco-responsables en matériaux recyclés, certifiés Fair Trade.",
                        distance_km: 122,
                        rating: 4,
                        ethical_prod: 4.2,
                        ethical_transports: 3.1,
                        transport: "BPost (BE)",
                        logo_url: "/logos/6k_logo.jpg",
                    },
                ],
            });
        }, 800); // simule ~0,8s de délai réseau
    });
}
