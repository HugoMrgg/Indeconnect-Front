import { useState, useCallback, useEffect, useRef } from "react";
import { UpdateBrandRequest } from "@/api/services/brands/types";
import { useUpdateBrand } from "@/hooks/BrandEdit/useUpdateBrand";
import { EditableBrandFields } from "@/types/brand";

export function useBrandEditing(brandId: number, initialData: UpdateBrandRequest) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<UpdateBrandRequest>(initialData);
    const [hasChanges, setHasChanges] = useState(false);

    const initialRef = useRef<UpdateBrandRequest>(initialData);
    const { updateBrand, loading: saving } = useUpdateBrand();

    // Quand la brand est chargée ou change (nouvel id), on reset le formulaire
    useEffect(() => {
        initialRef.current = initialData;
        setFormData(initialData);
        setHasChanges(false);
    }, [brandId, initialData]);

    const updateField = useCallback(
        <K extends keyof EditableBrandFields>(
            field: K,
            value: EditableBrandFields[K]
        ) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            setHasChanges(true);
        },
        []
    );

    const save = useCallback(async () => {
        try {
            // On envoie TOUT formData, qui contient les valeurs actuelles de tous les champs
            await updateBrand(brandId, formData);
            initialRef.current = formData;
            setHasChanges(false);
            return true;
        } catch {
            return false;
        }
    }, [brandId, formData, updateBrand]);

    const toggleEditMode = useCallback(() => {
        setEditMode((prev) => !prev);
    }, []);

    const discardChanges = useCallback(() => {
        setFormData(initialRef.current);
        setHasChanges(false);
    }, []);

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