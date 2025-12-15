import { OrderStatus } from "@/api/services/orders/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    Pending: "En attente de paiement",
    Paid: "Payée",
    Delivered: "Livrée",
    Cancelled: "Annulée",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
    Pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    Paid: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    Delivered: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    Cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};
