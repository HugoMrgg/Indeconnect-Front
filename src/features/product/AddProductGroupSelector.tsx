import React from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    const selectedGroup = productGroups.find((g) => g.id === selectedGroupId);

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('add_product.group.title')}</h3>
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
                        <option value="">{t('add_product.group.placeholder')}</option>
                        {productGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name} ({group.productCount} {t('add_product.group.color', { count: group.productCount })})
                            </option>
                        ))}
                    </select>

                    {selectedGroup && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>{t('add_product.group.description_label')}:</strong>{" "}
                                {selectedGroup.baseDescription}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}