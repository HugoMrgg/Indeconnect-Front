import React, { useState, useEffect } from "react";
import {
    UpsertBrandDepositRequest,
    DepositDTO,
} from "@/api/services/brands/types";
import { Loader2 } from "lucide-react";
import { useUpsertMyBrandDeposit } from "@/hooks/Brand/useUpsertMyBrandDeposit";

interface DepositModalProps {
    open: boolean;
    onClose: () => void;
    initialDeposit?: DepositDTO | null;
    onSaved: (deposit: DepositDTO) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
                                                              open,
                                                              onClose,
                                                              initialDeposit,
                                                              onSaved,
                                                          }) => {
    const [form, setForm] = useState<UpsertBrandDepositRequest>({
        number: 0,
        street: "",
        postalCode: "",
        city: "",
        country: "Belgique",
        // latitude / longitude ne sont plus demandés au user ;
        // soit tu les retires du type, soit tu laisses 0 et le backend les recalculera.
        latitude: 0,
        longitude: 0,
    });

    const { saving, error, upsertDeposit } = useUpsertMyBrandDeposit();

    useEffect(() => {
        if (!open) return;

        if (!initialDeposit) {
            // reset pour un nouveau dépôt
            setForm((f) => ({
                ...f,
                number: 0,
                street: "",
                postalCode: "",
                city: "",
                country: "Belgique",
            }));
            return;
        }

        // Option simple : pré-remplir juste la ville (tu l’as dans initialDeposit.city)
        setForm((f) => ({
            ...f,
            city: initialDeposit.city ?? "",
            country: "Belgique",
        }));
        // Si tu veux, tu peux parser initialDeposit.fullAddress pour remplir number/street/CP.
    }, [open, initialDeposit]);

    const handleChange =
        (field: keyof UpsertBrandDepositRequest) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const value =
                    field === "number"
                        ? Number(e.target.value)
                        : e.target.value;
                setForm((f) => ({ ...f, [field]: value }));
            };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const saved = await upsertDeposit(form);
        if (saved) {
            onSaved(saved);
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-semibold mb-4">Dépôt principal</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-3">
                        <div className="w-20">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                N°
                            </label>
                            <input
                                type="number"
                                value={form.number || ""}
                                onChange={handleChange("number")}
                                className="w-full px-2 py-1 border rounded text-sm"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Rue
                            </label>
                            <input
                                type="text"
                                value={form.street}
                                onChange={handleChange("street")}
                                className="w-full px-2 py-1 border rounded text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-28">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Code postal
                            </label>
                            <input
                                type="text"
                                value={form.postalCode}
                                onChange={handleChange("postalCode")}
                                className="w-full px-2 py-1 border rounded text-sm"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Ville
                            </label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={handleChange("city")}
                                className="w-full px-2 py-1 border rounded text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Pays
                        </label>
                        <input
                            type="text"
                            value={form.country}
                            onChange={handleChange("country")}
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            disabled={saving}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                "Enregistrer"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};