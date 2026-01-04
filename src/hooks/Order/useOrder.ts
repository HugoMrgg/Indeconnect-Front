import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, getOrder, getUserOrders, getOrderTracking } from "@/api/services/orders";
import { CreateOrderDto, OrderDto, OrderTrackingDto } from "@/api/services/orders/types";
import { extractErrorMessage } from "@/utils/errorHandling";
import toast from "react-hot-toast";
import { useState, useCallback } from "react";

export function useOrder() {
    const queryClient = useQueryClient();
    const [order, setOrder] = useState<OrderDto | null>(null);
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [tracking, setTracking] = useState<OrderTrackingDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMutation = useMutation({
        mutationFn: async (data: CreateOrderDto) => {
            return await createOrder(data);
        },
        onSuccess: (newOrder) => {
            setOrder(newOrder);
            toast.success("Commande créée avec succès !");
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (err) => {
            const message = extractErrorMessage(err);
            toast.error(message);
        },
    });

    const create = async (data: CreateOrderDto): Promise<OrderDto | null> => {
        try {
            return await createMutation.mutateAsync(data);
        } catch (err) {
            return null;
        }
    };

    // Récupérer une commande par ID
    const fetchById = useCallback(async (orderId: number): Promise<OrderDto | null> => {
        setLoading(true);
        setError(null);

        try {
            const fetchedOrder = await getOrder(orderId);
            setOrder(fetchedOrder);
            return fetchedOrder;
        } catch (err) {
            const message = extractErrorMessage(err);
            setError(message);
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
        } catch (err) {
            const message = extractErrorMessage(err);
            setError(message);
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
        } catch (err) {
            const message = extractErrorMessage(err);
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading: loading || createMutation.isPending,
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