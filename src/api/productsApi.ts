import { Product } from "@/types/Product";

// Simule une API qui renvoie des produits pour une marque donnée
export async function fetchProductsByBrand(brandName: string): Promise<Product[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sampleProducts: Product[] = Array.from({ length: Math.round(Math.random() * 30 + 1) }, (_, i) => ({
                id: i + 1,
                name: `${brandName} Product ${i + 1}`,
                brand: brandName,
                category: ["t-shirt", "sweat", "jeans", "pull"][i % 4],
                price: Math.round(Math.random() * 100 + 20),
                image: `/src/assets/${["t-shirt", "sweat", "jeans", "pull"][i % 4]}.png`,
                sizes: ["XS", "S", "M", "L", "XL", "XXL"].slice(0, Math.floor(Math.random() * 6) + 1),
                tags: ["nouveau", "promo", "tendance"].slice(
                    0,
                    Math.floor(Math.random() * 3)
                ),
            }));

            resolve(sampleProducts);
        }, 1000); // simulate 1s delay
    });
}
