import api from "@/api/api";
import { CreateOrderDto, OrderDto } from "./types";
import { ORDER_ROUTES } from "./routes";

/**
 * Crée une nouvelle commande
 */
export async function createOrder(data: CreateOrderDto): Promise<OrderDto> {
    const response = await api.post(ORDER_ROUTES.createOrder(), data);
    return response.data;
}

/**
 * Récupère une commande par son ID
 */
export async function getOrder(orderId: number): Promise<OrderDto> {
    const response = await api.get(ORDER_ROUTES.getOrder(orderId));
    return response.data;
}

/**
 * Récupère toutes les commandes d'un utilisateur
 */
export async function getUserOrders(userId: number): Promise<OrderDto[]> {
    const response = await api.get(ORDER_ROUTES.getUserOrders(userId));
    return response.data;
}
