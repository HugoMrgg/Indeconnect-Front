import React from "react";
import { useTranslation } from "react-i18next";
import { Truck, Package, MapPin, Store, Trash2 } from "lucide-react";
import { ShippingMethodDto } from "@/api/services/shipping/types";

interface ShippingMethodListProps {
    methods: ShippingMethodDto[];
    editMode?: boolean;
    onDelete?: (methodId: number) => void;
}

const getIcon = (type: string) => {
    switch (type) {
        case "HomeDelivery":
            return Truck;
        case "Locker":
            return Package;
        case "PickupPoint":
            return MapPin;
        case "StorePickup":
            return Store;
        default:
            return Truck;
    }
};

export function ShippingMethodList({ methods, editMode = false, onDelete }: ShippingMethodListProps) {
    const { t } = useTranslation();

    if (methods.length === 0) {
        return (
            <div className="text-center py-6">
                <Truck className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-500">
                    {editMode
                        ? t('shipping.list.no_methods_configured')
                        : t('shipping.list.no_methods_available')
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {methods.map((method) => {
                const Icon = getIcon(method.methodType);
                return (
                    <div
                        key={method.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Icon size={20} className="text-gray-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-medium">{method.displayName}</p>
                            <p className="text-sm text-gray-600">
                                {method.providerName} • {method.estimatedMinDays}-
                                {method.estimatedMaxDays} {t('shipping.list.days')}
                            </p>
                        </div>
                        <p className="font-semibold">
                            {method.price === 0
                                ? t('checkout.free')
                                : `${method.price.toFixed(2)} €`
                            }
                        </p>

                        {/* Bouton de suppression en mode édition */}
                        {editMode && onDelete && (
                            <button
                                onClick={() => onDelete(method.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title={t('common.delete')}
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}