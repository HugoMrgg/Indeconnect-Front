import React from "react";
import { Loader2 } from "lucide-react";
import { ProductGroupSummaryDto } from "@/api/services/products/types";

interface AddProductGroupSelectorProps {
    productGroups: ProductGroupSummaryDto[];
    selectedGroupId: number | null;
    loading: boolean;
    onSelectGroup: (groupId: number) => void;
}

export function AddProductGroupSelector({
    productGroups,
    selectedGroupId,
    loading,
    onSelectGroup,
}: AddProductGroupSelectorProps) {
    const selectedGroup = productGroups.find((g) => g.id === selectedGroupId);

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Sélectionner le groupe de produit</h3>
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin" size={32} />
                </div>
            ) : (
                <>
                    <select
                        value={selectedGroupId || ""}
                        onChange={(e) => onSelectGroup(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        required
                    >
                        <option value="">Choisissez un groupe de produit</option>
                        {productGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name} ({group.productCount} couleur
                                {group.productCount > 1 ? "s" : ""})
                            </option>
                        ))}
                    </select>

                    {selectedGroup && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Description du groupe :</strong>{" "}
                                {selectedGroup.baseDescription}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
