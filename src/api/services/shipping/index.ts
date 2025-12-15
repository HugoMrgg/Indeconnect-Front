import api from "@/api/api";
import {
    ShippingAddressDto,
    CreateShippingAddressDto,
    ShippingMethodDto,
    CreateShippingMethodDto,
    UpdateShippingMethodDto
} from "./types";
import { SHIPPING_ROUTES } from "./routes";

export async function getUserAddresses(userId: number): Promise<ShippingAddressDto[]> {
    const response = await api.get(SHIPPING_ROUTES.getUserAddresses(userId));
    return response.data;
}

export async function createShippingAddress(
    userId: number,
    data: CreateShippingAddressDto
): Promise<ShippingAddressDto> {
    const response = await api.post(SHIPPING_ROUTES.createAddress(userId), data);
    return response.data;
}

/**
 * Récupère les méthodes de livraison disponibles pour une marque
 * Utilisé dans le checkout côté client
 */
export async function getBrandShippingMethods(brandId: number): Promise<ShippingMethodDto[]> {
    const response = await api.get(SHIPPING_ROUTES.getBrandMethods(brandId));
    return response.data;
}

/**
 * Récupère les méthodes pour plusieurs marques (optimisé)
 * Utilisé dans le checkout pour charger toutes les marques du panier en une fois
 */
export async function getMultipleBrandsShippingMethods(
    brandIds: number[]
): Promise<Record<number, ShippingMethodDto[]>> {
    const response = await api.post(SHIPPING_ROUTES.getMultipleBrandsMethods(), brandIds);
    return response.data;
}

/**
 * Crée une nouvelle méthode de livraison pour sa marque
 * Utilisé dans MyBrandPage par le SuperVendor
 */
export async function createBrandShippingMethod(
    brandId: number,
    data: CreateShippingMethodDto
): Promise<ShippingMethodDto> {
    const response = await api.post(SHIPPING_ROUTES.createBrandMethod(brandId), data);
    return response.data;
}

/**
 * Modifie une méthode de livraison existante
 */
export async function updateBrandShippingMethod(
    brandId: number,
    methodId: number,
    data: UpdateShippingMethodDto
): Promise<ShippingMethodDto> {
    const response = await api.put(
        SHIPPING_ROUTES.updateBrandMethod(brandId, methodId),
        data
    );
    return response.data;
}

/**
 * Supprime une méthode de livraison
 */
export async function deleteBrandShippingMethod(
    brandId: number,
    methodId: number
): Promise<void> {
    await api.delete(SHIPPING_ROUTES.deleteBrandMethod(brandId, methodId));
}
