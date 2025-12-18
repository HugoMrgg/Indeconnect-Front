import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Truck, Package, MapPin, Store, Trash2, Loader2 } from "lucide-react";
import { useShipping } from "@/hooks/Order/useShipping";

type Props = {
    brandId: number;
    editMode?: boolean;
};

type MethodType = "HomeDelivery" | "Locker" | "PickupPoint" | "StorePickup";

type FormData = {
    providerName: string;
    methodType: MethodType;
    displayName: string;
    price: number;
    estimatedMinDays: number;
    estimatedMaxDays: number;
};

const INITIAL_FORM_DATA: FormData = {
    providerName: "",
    methodType: "HomeDelivery",
    displayName: "",
    price: 0,
    estimatedMinDays: 1,
    estimatedMaxDays: 3,
};

export function ShippingMethodsManager({ brandId, editMode = false }: Props) {
    const {
        methods,
        loading,
        fetchBrandMethods,
        createMethod,
        deleteMethod
    } = useShipping();

    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

    // Charger les méthodes de livraison
    const loadMethods = useCallback(async () => {
        await fetchBrandMethods(brandId);
    }, [brandId, fetchBrandMethods]);

    useEffect(() => {
        loadMethods();
    }, [loadMethods]);

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

    const handleAdd = async () => {
        if (!isFormValid) {
            return;
        }

        if (formData.estimatedMaxDays < formData.estimatedMinDays) {
            return;
        }

        setSubmitting(true);
        try {
            const newMethod = await createMethod(brandId, formData);
            if (newMethod) {
                setShowForm(false);
                setFormData(INITIAL_FORM_DATA);
                await loadMethods(); // Recharger la liste
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (methodId: number) => {
        if (!window.confirm("Supprimer cette méthode de livraison ?")) return;

        const success = await deleteMethod(brandId, methodId);
        if (success) {
            await loadMethods(); // Recharger la liste
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "HomeDelivery": return Truck;
            case "Locker": return Package;
            case "PickupPoint": return MapPin;
            case "StorePickup": return Store;
            default: return Truck;
        }
    };

    // État de chargement
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        );
    }

    // Mode lecture seule (non-editMode)
    if (!editMode) {
        return (
            <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Méthodes de livraison</h3>
                {methods.length === 0 ? (
                    <div className="text-center py-6">
                        <Truck className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-500">Aucune méthode configurée</p>
                    </div>
                ) : (
                    methods.map((method) => {
                        const Icon = getIcon(method.methodType);
                        return (
                            <div key={method.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Icon size={20} className="text-gray-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-medium">{method.displayName}</p>
                                    <p className="text-sm text-gray-600">
                                        {method.providerName} • {method.estimatedMinDays}-{method.estimatedMaxDays} jours
                                    </p>
                                </div>
                                <p className="font-semibold">
                                    {method.price === 0 ? "Gratuit" : `${method.price.toFixed(2)} €`}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        );
    }

    // Mode édition
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Méthodes de livraison</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} />
                    {showForm ? "Annuler" : "Ajouter"}
                </button>
            </div>

            {/* Liste des méthodes */}
            {methods.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Truck className="mx-auto text-gray-400 mb-2" size={40} />
                    <p className="text-gray-600 font-medium mb-1">Aucune méthode configurée</p>
                    <p className="text-gray-500 text-sm">
                        Ajoutez une méthode de livraison pour commencer
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {methods.map((method) => {
                        const Icon = getIcon(method.methodType);
                        return (
                            <div key={method.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <Icon size={20} className="text-gray-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{method.displayName}</p>
                                    <p className="text-sm text-gray-600">
                                        {method.providerName} • {method.estimatedMinDays}-{method.estimatedMaxDays} jours •{" "}
                                        {method.price === 0 ? "Gratuit" : `${method.price.toFixed(2)} €`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(method.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Formulaire d'ajout */}
            {showForm && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <h4 className="font-medium text-gray-900">Nouvelle méthode</h4>

                    {/* Nom du transporteur */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nom du transporteur <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.providerName}
                            onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                            placeholder="ex: BPost, Colruyt, DHL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Type de livraison */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            value={formData.methodType}
                            onChange={(e) => setFormData({ ...formData, methodType: e.target.value as MethodType })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="HomeDelivery">Livraison à domicile</option>
                            <option value="Locker">Point relais / Casier</option>
                            <option value="PickupPoint">Point de collecte</option>
                            <option value="StorePickup">Retrait en magasin</option>
                        </select>
                    </div>

                    {/* Nom affiché */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nom affiché <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            placeholder="ex: BPost - Livraison standard"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Prix et délai */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Prix (€)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Math.max(0, parseFloat(e.target.value) || 0) })}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Délai (jours)</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    value={formData.estimatedMinDays}
                                    onChange={(e) => setFormData({ ...formData, estimatedMinDays: Math.max(1, parseInt(e.target.value) || 1) })}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-gray-600">-</span>
                                <input
                                    type="number"
                                    value={formData.estimatedMaxDays}
                                    onChange={(e) => setFormData({ ...formData, estimatedMaxDays: Math.max(formData.estimatedMinDays, parseInt(e.target.value) || 1) })}
                                    min={formData.estimatedMinDays}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleAdd}
                            disabled={submitting || !isFormValid}
                            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Ajout en cours...
                                </>
                            ) : (
                                "Ajouter"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setFormData(INITIAL_FORM_DATA);
                            }}
                            disabled={submitting}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}