import { useState, useCallback } from "react";
import { UpdateBrandRequest } from "@/api/services/brands/types";
import { useUpdateBrand } from "@/hooks/BrandEdit/useUpdateBrand";
import { EditableBrandFields } from "@/types/brand";

export function useBrandEditing(brandId: number, initialData: UpdateBrandRequest) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<UpdateBrandRequest>(initialData);
    const [hasChanges, setHasChanges] = useState(false);

    const { updateBrand, loading: saving } = useUpdateBrand();

    const updateField = useCallback(<K extends keyof EditableBrandFields>(
        field: K,
        value: EditableBrandFields[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const save = useCallback(async () => {
        try {
            await updateBrand(brandId, formData);
            setHasChanges(false);
            return true;
        } catch (error) {
            return false;
        }
    }, [brandId, formData, updateBrand]);

    const toggleEditMode = useCallback(() => {
        setEditMode(prev => !prev);
    }, []);

    const discardChanges = useCallback(() => {
        setFormData(initialData);
        setHasChanges(false);
    }, [initialData]);

    return {
        editMode,
        toggleEditMode,
        formData,
        updateField,
        save,
        saving,
        hasChanges,
        discardChanges,
    };
}