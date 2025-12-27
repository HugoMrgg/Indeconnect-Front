import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useShipping } from "@/hooks/Order/useShipping";
import { ShippingMethodForm, FormData } from "./ShippingMethodForm";
import { ShippingMethodList } from "./ShippingMethodList";

type Props = {
    brandId: number;
    editMode?: boolean;
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
    const { methods, loading, fetchBrandMethods, createMethod, deleteMethod } = useShipping();

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

    const handleAdd = async () => {
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

    const handleCancelForm = () => {
        setShowForm(false);
        setFormData(INITIAL_FORM_DATA);
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
                <ShippingMethodList methods={methods} editMode={false} />
            </div>
        );
    }

    // Mode édition
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Méthodes de livraison</h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                        <Plus size={16} />
                        Ajouter
                    </button>
                )}
            </div>

            {/* Formulaire d'ajout */}
            {showForm && (
                <ShippingMethodForm
                    formData={formData}
                    submitting={submitting}
                    onChange={setFormData}
                    onSubmit={handleAdd}
                    onCancel={handleCancelForm}
                />
            )}

            {/* Liste des méthodes */}
            <ShippingMethodList methods={methods} editMode={true} onDelete={handleDelete} />
        </div>
    );
}
