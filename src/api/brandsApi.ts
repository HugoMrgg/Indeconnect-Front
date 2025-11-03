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
                    },
                    {
                        name: "Namur Style",
                        city: "Namur",
                        description:
                            "Une marque locale qui met à l’honneur les créateurs de la région namuroise.",
                    },
                ],
                ethical: [
                    {
                        name: "EcoWear",
                        city: "Bruxelles",
                        description: "Mode durable et éthique fabriquée en Europe.",
                    },
                    {
                        name: "TerraNova",
                        city: "Gand",
                        description:
                            "Des vêtements éco-responsables en matériaux recyclés, certifiés Fair Trade.",
                    },
                ],
            });
        }, 800); // simule ~0,8s de délai réseau
    });
}
