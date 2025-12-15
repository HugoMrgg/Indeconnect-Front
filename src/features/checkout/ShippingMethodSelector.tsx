import { useEffect, useCallback, useMemo } from "react";
import { Truck, Package, MapPin, Store, Loader2, AlertCircle } from "lucide-react";
import { CartItemDto } from "@/api/services/cart/types";
import { useShipping } from "@/hooks/Order/useShipping";
import {ShippingMethodDto} from "@/api/services/shipping/types";

type Props = {
    brandId: number;
    brandName: string;
    items: CartItemDto[];
    selectedMethodId?: number;
    onSelectMethod: (methodId: number, price: number, displayName: string) => void;
};

export function ShippingMethodSelector({
                                           brandId,
                                           brandName,
                                           items,
                                           selectedMethodId,
                                           onSelectMethod,
                                       }: Props) {
    const { methods, loading, error, fetchBrandMethods } = useShipping();

    // Charger les méthodes de livraison pour la marque
    const loadMethods = useCallback(async () => {
        const data = await fetchBrandMethods(brandId);

        // Auto-sélection de la première méthode uniquement si aucune n'est sélectionnée
        if (data && !selectedMethodId && data.length > 0) {
            const firstMethod = data[0];
            onSelectMethod(firstMethod.id, firstMethod.price, firstMethod.displayName);
        }
    }, [brandId, selectedMethodId, onSelectMethod, fetchBrandMethods]);

    useEffect(() => {
        loadMethods();
    }, [loadMethods]);

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

    // Formater la durée de livraison
    const getEstimatedDays = (method: ShippingMethodDto) => {
        if (method.estimatedMinDays === method.estimatedMaxDays) {
            return `${method.estimatedMinDays} jour${method.estimatedMinDays > 1 ? "s" : ""}`;
        }
        return `${method.estimatedMinDays}-${method.estimatedMaxDays} jours`;
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

    // État d'erreur avec bouton réessayer
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
                    <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <p className="text-red-800 font-medium mb-1">Erreur de chargement</p>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={loadMethods}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Réessayer
                    </button>
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
                    <p className="text-gray-600 font-medium mb-1">Aucune méthode disponible</p>
                    <p className="text-gray-500 text-sm">
                        Cette marque n'a pas encore configuré de méthodes de livraison.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {methods.map((method) => {
                        const Icon = getIcon(method.methodType);
                        const isSelected = selectedMethodId === method.id;

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
                                    <p className="text-sm text-gray-600">
                                        {method.providerName} • {getEstimatedDays(method)}
                                    </p>
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
                                    {method.price === 0 ? "Gratuit" : `${method.price.toFixed(2)} €`}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}