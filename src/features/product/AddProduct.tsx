import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/Auth/useAuth";

type Props = {
    brandId?: number; // optionnel si tu crées depuis une marque
};

export function AddProduct({ brandId }: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const canManage =
        user?.role === "Vendor" ||
        user?.role === "SuperVendor" ||
        user?.role === "Administrator";

    if (!canManage) return null;

    return (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-gray-500">Espace vendeur</p>
                    <h3 className="text-base font-semibold text-gray-900">
                        Gérer tes produits
                    </h3>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            brandId
                                ? `/products/create?brandId=${brandId}`
                                : `/products/create`
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
                >
                    <Plus size={18} />
                    Ajouter un produit
                </button>
            </div>
        </div>
    );
}
