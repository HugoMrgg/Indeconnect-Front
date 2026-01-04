import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Truck, Package, MapPin, Store, Loader2, AlertCircle, Calendar } from "lucide-react";
import { CartItemDto } from "@/api/services/cart/types";
import { useShipping } from "@/hooks/Order/useShipping";
import { ShippingMethodDto } from "@/api/services/shipping/types";

type Props = {
    brandId: number;
    brandName: string;
    items: CartItemDto[];
    selectedMethodId?: number;
    addressId?: number | null;
    onSelectMethod: (methodId: number, price: number, displayName: string) => void;
};

export function ShippingMethodSelector({
                                           brandId,
                                           brandName,
                                           items,
                                           selectedMethodId,
                                           addressId,
                                           onSelectMethod,
                                       }: Props) {
    const { t } = useTranslation();
    const { methods, loading, error, fetchBrandMethods } = useShipping();

    // Ref pour éviter l'auto-sélection en boucle
    const hasAutoSelected = useRef(false);

    // Charger les méthodes uniquement quand brandId ou addressId change
    useEffect(() => {
        fetchBrandMethods(brandId, addressId || undefined);
        hasAutoSelected.current = false; // Reset lors du changement d'adresse
    }, [brandId, addressId, fetchBrandMethods]);

    // Auto-sélection dans un useEffect séparé
    useEffect(() => {
        if (!loading && methods.length > 0 && !selectedMethodId && !hasAutoSelected.current) {
            hasAutoSelected.current = true;
            const firstMethod = methods[0];
            onSelectMethod(firstMethod.id, firstMethod.price, firstMethod.displayName);
        }
    }, [methods, loading, selectedMethodId, onSelectMethod]);

    // Calcul memoïzé du total d'articles
    const totalItems = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    // Fonction pour obtenir l'icône selon le type
    const getIcon = (methodType: string) => {
        switch (methodType) {
            case "HomeDelivery": return Truck;
            case "Locker": return Package;
            case "PickupPoint": return MapPin;
            case "StorePickup": return Store;
            default: return Truck;
        }
    };

    // Formater la durée de livraison avec les délais calculés
    const getEstimatedDays = (method: ShippingMethodDto) => {
        const minDays = method.totalEstimatedMinDays ?? method.estimatedMinDays;
        const maxDays = method.totalEstimatedMaxDays ?? method.estimatedMaxDays;

        if (minDays === maxDays) {
            return `${minDays} jour${minDays > 1 ? "s" : ""}`;
        }
        return `${minDays}-${maxDays} jours`;
    };

    // Formater la date de livraison
    const formatDeliveryDate = (method: ShippingMethodDto) => {
        if (!method.estimatedDeliveryDate) return null;

        const date = new Date(method.estimatedDeliveryDate);
        return date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });
    };

    // État de chargement
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">{brandName}</h3>
                    <p className="text-sm text-gray-600">
                        {totalItems} article{totalItems > 1 ? "s" : ""}
                    </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <p className="text-red-800 font-medium mb-1">Erreur de chargement</p>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">{brandName}</h3>
                <p className="text-sm text-gray-600">
                    {totalItems} article{totalItems > 1 ? "s" : ""}
                </p>
            </div>

            {methods.length === 0 ? (
                <div className="text-center py-6">
                    <Truck className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 font-medium mb-1">{t('common.loading')}</p>
                    <p className="text-gray-500 text-sm">
                        {t('common.loading')}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {methods.map((method) => {
                        const Icon = getIcon(method.methodType);
                        const isSelected = selectedMethodId === method.id;
                        const deliveryDate = formatDeliveryDate(method);

                        return (
                            <button
                                key={method.id}
                                onClick={() => onSelectMethod(method.id, method.price, method.displayName)}
                                disabled={!method.isEnabled}
                                className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                                    isSelected
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                } ${!method.isEnabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                <Icon
                                    size={24}
                                    className={`flex-shrink-0 ${
                                        isSelected ? "text-blue-600" : "text-gray-400"
                                    }`}
                                />

                                <div className="flex-1 text-left">
                                    <p className="font-medium text-gray-900">{method.displayName}</p>

                                    <div className="mt-1 space-y-1">
                                        <p className="text-sm text-gray-600">
                                            {method.providerName} • {getEstimatedDays(method)}
                                        </p>

                                        {/* Date de livraison estimée */}
                                        {deliveryDate && (
                                            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                                <Calendar size={12} />
                                                <span>Livraison estimée: {deliveryDate}</span>
                                            </div>
                                        )}
                                    </div>

                                    {!method.isEnabled && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Temporairement indisponible
                                        </p>
                                    )}
                                </div>

                                <p
                                    className={`font-semibold ${
                                        method.price === 0 ? "text-green-600" : "text-gray-900"
                                    }`}
                                >
                                    {method.price === 0 ? t('checkout.free') : `${method.price.toFixed(2)} €`}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}