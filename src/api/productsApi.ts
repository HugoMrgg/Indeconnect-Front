import { Product } from "@/types/Product";

const COLORS = ["white","black","red","blue","green","yellow","pink","orange","purple","brown","gray"] as const;
const ETHICS = ["bio", "recyclé", "upcycling", "local", "made in belgium", "équitable"] as const;

export async function fetchProductsByBrand(brandName: string): Promise<Product[]> {
    return new Promise((resolve) => {
        setTimeout(() => {

            const sampleProducts: Product[] = Array.from(
                { length: Math.round(Math.random() * 30 + 1) },
                (_, i) => {
                    const category = ["t-shirt", "sweat", "jeans", "pull"][i % 4];
                    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

                    return {
                        id: i + 1,
                        name: `${brandName} Product ${i + 1}`,
                        brand: brandName,
                        category,
                        price: Math.round(Math.random() * 100 + 20),
                        image: `/src/assets/${category}.png`,
                        sizes: ["XS", "S", "M", "L", "XL", "XXL"].slice(
                            0,
                            Math.floor(Math.random() * 6) + 1
                        ),
                        tags: ["nouveau", "promo", "tendance"].slice(
                            0,
                            Math.floor(Math.random() * 3)
                        ),

                        // ✅ Nouveaux filtres
                        color,
                        ethics: ETHICS.slice(
                            0,
                            Math.floor(Math.random() * 3) // entre 0 et 2 étiquettes
                        ),
                    };
                }
            );

            resolve(sampleProducts);
        }, 1000);
    });
}

