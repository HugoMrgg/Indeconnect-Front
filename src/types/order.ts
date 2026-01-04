import { OrderStatus, DeliveryStatus } from "@/api/services/orders/types";

// Clés i18n pour les statuts de commande
export const ORDER_STATUS_I18N_KEYS: Record<OrderStatus, string> = {
    Pending: "orders.statuses.pending",
    Paid: "orders.statuses.paid",
    Processing: "orders.statuses.processing",
    Delivered: "orders.statuses.delivered",
    Cancelled: "orders.statuses.cancelled",
};

// Couleurs pour les statuts de commande
export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
    Pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    Paid: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    Processing: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    Delivered: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    Cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

// Clés i18n pour les statuts de livraison
export const DELIVERY_STATUS_I18N_KEYS: Record<DeliveryStatus, string> = {
    Pending: "orders.delivery.statuses.preparing",
    Preparing: "orders.delivery.statuses.preparing",
    Shipped: "orders.delivery.statuses.shipped",
    InTransit: "orders.delivery.statuses.in_transit",
    OutForDelivery: "orders.delivery.statuses.out_for_delivery",
    Delivered: "orders.delivery.statuses.delivered",
    Failed: "orders.delivery.statuses.failed",
    Returned: "orders.delivery.statuses.returned",
    Cancelled: "orders.statuses.cancelled",
};

// Compatibilité - à garder pour maintenant mais utiliser les clés i18n à la place
export const ORDER_STATUS_LABELS = ORDER_STATUS_I18N_KEYS;
export const DELIVERY_STATUS_LABELS = DELIVERY_STATUS_I18N_KEYS;
