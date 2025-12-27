import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";

type MethodType = "HomeDelivery" | "Locker" | "PickupPoint" | "StorePickup";

export interface FormData {
    providerName: string;
    methodType: MethodType;
    displayName: string;
    price: number;
    estimatedMinDays: number;
    estimatedMaxDays: number;
}

interface ShippingMethodFormProps {
    formData: FormData;
    submitting: boolean;
    onChange: (data: FormData) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export function ShippingMethodForm({
    formData,
    submitting,
    onChange,
    onSubmit,
    onCancel,
}: ShippingMethodFormProps) {
    // Validation du formulaire
    const isFormValid = useMemo(() => {
        return (
            formData.providerName.trim().length > 0 &&
            formData.displayName.trim().length > 0 &&
            formData.estimatedMinDays > 0 &&
            formData.estimatedMaxDays >= formData.estimatedMinDays &&
            formData.price >= 0
        );
    }, [formData]);

    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                {/* Provider Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Transporteur</label>
                    <input
                        type="text"
                        value={formData.providerName}
                        onChange={(e) =>
                            onChange({ ...formData, providerName: e.target.value })
                        }
                        placeholder="Colissimo, Chronopost..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Display Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Nom affiché</label>
                    <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) =>
                            onChange({ ...formData, displayName: e.target.value })
                        }
                        placeholder="Livraison standard..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Method Type */}
                <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                        value={formData.methodType}
                        onChange={(e) =>
                            onChange({
                                ...formData,
                                methodType: e.target.value as MethodType,
                            })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="HomeDelivery">Livraison domicile</option>
                        <option value="Locker">Consigne automatique</option>
                        <option value="PickupPoint">Point relais</option>
                        <option value="StorePickup">Retrait en magasin</option>
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium mb-1">Prix (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                            onChange({ ...formData, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Min Days */}
                <div>
                    <label className="block text-sm font-medium mb-1">Délai min (jours)</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.estimatedMinDays}
                        onChange={(e) =>
                            onChange({
                                ...formData,
                                estimatedMinDays: parseInt(e.target.value) || 1,
                            })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Max Days */}
                <div>
                    <label className="block text-sm font-medium mb-1">Délai max (jours)</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.estimatedMaxDays}
                        onChange={(e) =>
                            onChange({
                                ...formData,
                                estimatedMaxDays: parseInt(e.target.value) || 1,
                            })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Error message */}
            {formData.estimatedMaxDays < formData.estimatedMinDays && (
                <p className="text-sm text-red-600">
                    Le délai maximum doit être supérieur ou égal au délai minimum
                </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={onSubmit}
                    disabled={!isFormValid || submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Ajout...
                        </>
                    ) : (
                        "Ajouter"
                    )}
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
}
