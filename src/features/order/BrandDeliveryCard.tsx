import { BrandDeliveryTrackingDto } from "@/api/services/orders/types";
import { OrderTracker } from "./OrderTracker";
import { Package, Truck, Calendar, ShoppingBag } from "lucide-react";

type Props = {
    delivery: BrandDeliveryTrackingDto;
};

export function BrandDeliveryCard({ delivery }: Props) {
    const estimatedDate = delivery.estimatedDelivery
        ? new Date(delivery.estimatedDelivery).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : null;

    const deliveredDate = delivery.deliveredAt
        ? new Date(delivery.deliveredAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : null;

    // Badge de statut
    const getStatusBadge = () => {
        const statusConfig: Record<string, { label: string; color: string }> = {
            Pending: { label: "En attente", color: "bg-gray-100 text-gray-700" },
            Preparing: { label: "En préparation", color: "bg-yellow-100 text-yellow-700" },
            Shipped: { label: "Expédiée", color: "bg-blue-100 text-blue-700" },
            InTransit: { label: "En transit", color: "bg-indigo-100 text-indigo-700" },
            OutForDelivery: { label: "En cours de livraison", color: "bg-purple-100 text-purple-700" },
            Delivered: { label: "Livrée", color: "bg-green-100 text-green-700" },
            Failed: { label: "Échec", color: "bg-red-100 text-red-700" },
            Returned: { label: "Retournée", color: "bg-orange-100 text-orange-700" },
            Cancelled: { label: "Annulée", color: "bg-red-100 text-red-700" },
        };

        const config = statusConfig[delivery.status] || statusConfig.Pending;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {/* En-tête de la marque */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        {delivery.brandLogoUrl && (
                            <img
                                src={delivery.brandLogoUrl}
                                alt={delivery.brandName}
                                className="w-16 h-16 object-contain rounded-lg bg-white p-2 shadow-sm"
                            />
                        )}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{delivery.brandName}</h3>
                            <p className="text-sm text-gray-600">
                                Livraison #{delivery.brandDeliveryId}
                            </p>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>

                {/* Numéro de tracking */}
                {delivery.trackingNumber && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 text-sm">
                            <Truck className="text-gray-500" size={18} />
                            <span className="font-medium text-gray-700">Numéro de suivi :</span>
                            <span className="font-mono font-bold text-gray-900">
                                {delivery.trackingNumber}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Articles de cette marque */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <ShoppingBag className="text-gray-700" size={20} />
                        <h4 className="font-bold text-gray-900">
                            Articles ({delivery.items.length})
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {delivery.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                    <p className="text-sm text-gray-600">Quantité : {item.quantity}</p>
                                </div>
                                <p className="font-bold text-gray-900">
                                    {item.unitPrice.toFixed(2)} €
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-gray-700">Sous-total :</span>
                        <span className="text-xl font-bold text-gray-900">
                            {delivery.totalAmount.toFixed(2)} €
                        </span>
                    </div>
                </div>

                {/* Dates importantes */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                    {delivery.shippedAt && (
                        <div className="flex items-center gap-2 text-sm">
                            <Truck className="text-blue-600" size={16} />
                            <span className="text-gray-600">Expédié le :</span>
                            <span className="font-medium text-gray-900">
                                {new Date(delivery.shippedAt).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    )}
                    {deliveredDate && (
                        <div className="flex items-center gap-2 text-sm">
                            <Package className="text-green-600" size={16} />
                            <span className="text-gray-600">Livré le :</span>
                            <span className="font-medium text-gray-900">{deliveredDate}</span>
                        </div>
                    )}
                    {estimatedDate && delivery.status !== "Delivered" && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="text-indigo-600" size={16} />
                            <span className="text-gray-600">Livraison estimée :</span>
                            <span className="font-medium text-gray-900">{estimatedDate}</span>
                        </div>
                    )}
                </div>

                {/* Timeline de cette livraison */}
                <OrderTracker timeline={delivery.timeline} />
            </div>
        </div>
    );
}
