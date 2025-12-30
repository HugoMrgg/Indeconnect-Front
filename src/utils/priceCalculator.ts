import { Sale } from "@/types/Product";

interface PriceCalculation {
    current: number;
    original: number | null;
    discount: number | null;
}

export function calculatePrice(basePrice: number, sale?: Sale | null): PriceCalculation {
    if (!sale || !sale.isActive) {
        return {
            current: basePrice,
            original: null,
            discount: null
        };
    }

    const discount = sale.discountPercentage;
    const current = basePrice * (1 - discount / 100);

    return {
        current: Math.round(current * 100) / 100,
        original: basePrice,
        discount: discount
    };
}