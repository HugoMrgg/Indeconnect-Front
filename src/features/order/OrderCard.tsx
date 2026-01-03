import { useState } from "react";
import { OrderDto } from "@/api/services/orders/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Package, Calendar, CreditCard, ChevronRight, Receipt, Store, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PaymentModal } from "@/features/checkout/PaymentModal";

type Props = {
    order: OrderDto;
};

export function OrderCard({ order }: Props) {
    const navigate = useNavigate();
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const orderDate = new Date(order.placedAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const uniqueBrands = new Set(order.invoices.map(inv => inv.brandId)).size;

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

                    {/* Nombre de marques */}
                    {uniqueBrands > 1 && (
                        <div className="flex items-center gap-2">
                            <Store className="text-gray-400" size={18} />
                            <span className="text-sm text-gray-600">
                                {uniqueBrands} marques
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                Livraisons séparées
                            </span>
                        </div>
                    )}

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
                <div className="flex gap-3">
                    {/* Bouton Payer si commande en attente */}
                    {order.status === "Pending" && (
                        <button
                            onClick={() => setPaymentModalOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            <Wallet size={18} />
                            Payer maintenant
                        </button>
                    )}

                    {/* Bouton Suivre la commande */}
                    <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className={`${order.status === "Pending" ? "flex-1" : "w-full"} flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors`}
                    >
                        Suivre ma commande
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Modal de paiement */}
            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                orderId={order.id}
                onPaymentSuccess={() => {
                    setPaymentModalOpen(false);
                    navigate(`/orders/${order.id}`);
                }}
            />
        </div>
    );
}
