import axiosInstance from "@/api/api";
import { CartDto } from "./types";

// Ajout au panier d’une variante
export async function addVariantToCart(
    userId: number,
    variantId: number,
    quantity: number
): Promise<CartDto> {
    const res = await axiosInstance.post(
        `/users/${userId}/cart/variant/${variantId}`,
        { quantity }
    );
    return res.data;
}

// Récupérer le panier
export async function getCart(userId: number): Promise<CartDto> {
    const res = await axiosInstance.get(`/users/${userId}/cart`);
    return res.data;
}
