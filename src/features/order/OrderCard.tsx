import { OrderDto } from "@/api/services/orders/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Package, Calendar, CreditCard, ChevronRight, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
    order: OrderDto;
};

export function OrderCard({ order }: Props) {
    const navigate = useNavigate();

    const orderDate = new Date(order.placedAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
            <div className="p-6">
                {/* En-tête */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="text-gray-400" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Commande #{order.id}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            <span>{orderDate}</span>
                        </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Détails */}
                <div className="space-y-2 mb-4 pb-4 border-b">
                    {/* Montant total */}
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-gray-400" size={18} />
                        <span className="text-sm text-gray-600">Total :</span>
                        <span className="text-lg font-bold text-gray-900">
                            {order.totalAmount.toFixed(2)} {order.currency}
                        </span>
                    </div>

                    {/* Nombre d'articles */}
                    <div className="flex items-center gap-2">
                        <Package className="text-gray-400" size={18} />
                        <span className="text-sm text-gray-600">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} article
                            {order.items.reduce((sum, item) => sum + item.quantity, 0) > 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Factures par marque */}
                    {order.invoices.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Receipt className="text-gray-400" size={18} />
                            <span className="text-sm text-gray-600">
                                {order.invoices.length} facture{order.invoices.length > 1 ? "s" : ""}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Voir les détails
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
