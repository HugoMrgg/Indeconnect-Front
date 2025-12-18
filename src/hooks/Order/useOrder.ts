import { useState, useCallback } from "react";
import { createOrder, getOrder, getUserOrders, getOrderTracking } from "@/api/services/orders";
import { CreateOrderDto, OrderDto, OrderTrackingDto } from "@/api/services/orders/types";
import { extractErrorMessage } from "@/utils/errorHandling";
import toast from "react-hot-toast";

export function useOrder() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<OrderDto | null>(null);
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [tracking, setTracking] = useState<OrderTrackingDto | null>(null);

    // Créer une commande
    const create = useCallback(async (data: CreateOrderDto): Promise<OrderDto | null> => {
        setLoading(true);
        setError(null);

        try {
            const newOrder = await createOrder(data);
            setOrder(newOrder);
            toast.success("Commande créée avec succès !");
            return newOrder;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            toast.error(message);
            console.error("[useOrder] create error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer une commande par ID
    const fetchById = useCallback(async (orderId: number): Promise<OrderDto | null> => {
        setLoading(true);
        setError(null);

        try {
            const fetchedOrder = await getOrder(orderId);
            setOrder(fetchedOrder);
            return fetchedOrder;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            console.error("[useOrder] fetchById error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer toutes les commandes d'un utilisateur
    const fetchUserOrders = useCallback(async (userId: number): Promise<OrderDto[] | null> => {
        setLoading(true);
        setError(null);

        try {
            const userOrders = await getUserOrders(userId);
            setOrders(userOrders);
            return userOrders;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            console.error("[useOrder] fetchUserOrders error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer le suivi détaillé d'une commande
    const fetchTracking = useCallback(async (orderId: number): Promise<OrderTrackingDto | null> => {
        setLoading(true);
        setError(null);

        try {
            const trackingData = await getOrderTracking(orderId);
            setTracking(trackingData);
            return trackingData;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            console.error("[useOrder] fetchTracking error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        order,
        orders,
        tracking,
        create,
        fetchById,
        fetchUserOrders,
        fetchTracking,
    };
}