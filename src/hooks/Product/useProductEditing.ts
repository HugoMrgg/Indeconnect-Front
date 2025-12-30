import { useState, useEffect, useMemo } from "react";
import { ProductDetail } from "@/types/Product";
import { updateProduct } from "@/api/services/products";
import type { UpdateProductRequest } from "@/api/services/products/types";

type ProductStatus = "Draft" | "Active" | "Online" | "Disabled";

interface SaleData {
    id?: number;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    description?: string;
}

interface VariantData {
    sizeId: number;
    sizeName: string;
    stockCount: number;
    id?: number;
}

interface MediaItem {
    url: string;
    type: "Image" | "Video";
    displayOrder: number;
    isPrimary: boolean;
}

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    status: ProductStatus;
    primaryColorId: number | null;
    categoryId: number;
    sale: SaleData | null;
    variants: VariantData[];
    media: MediaItem[];
}

export function useProductEditing(productId: number | null, product: ProductDetail | null) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        status: "Draft",
        primaryColorId: null,
        categoryId: 0,
        sale: null,
        variants: [],
        media: [],
    });

    const [initialData, setInitialData] = useState<ProductFormData | null>(null);
    const [saving, setSaving] = useState(false);

    // Initialiser le formData depuis le produit chargé
    useEffect(() => {
        if (product && productId) {
            const data: ProductFormData = {
                name: product.name,
                description: product.description,
                price: product.price,
                status: mapStatusFromBackend(product.status),
                primaryColorId: product.primaryColor?.id || null,
                // Handle both string and object category types from API response
                categoryId: typeof product.category === 'string'
                    ? 0  // Default value when category is a string identifier
                    : product.category?.id || 0, // Extract ID from category object
                sale: product.salePrice ? {
                    discountPercentage: calculateDiscountPercentage(product.price, product.salePrice),
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    description: "",
                } : null,
                variants: [], // Variants will be loaded separately from API
                // Ensure media type is explicitly cast to prevent type errors
                media: product.media.map((m) => ({
                    url: m.url,
                    type: (m.type === "Image" || m.type === "Video") ? m.type : "Image",
                    displayOrder: m.displayOrder,
                    isPrimary: m.isPrimary,
                })),
            };

            setFormData(data);
            setInitialData(data);
        }
    }, [product, productId]);

    // Détection des changements
    const hasChanges = useMemo(() => {
        if (!initialData) return false;
        return JSON.stringify(formData) !== JSON.stringify(initialData);
    }, [formData, initialData]);

    // Mise à jour d'un champ
    const updateField = <K extends keyof ProductFormData>(
        field: K,
        value: ProductFormData[K]
    ) => {
        setFormData({ ...formData, [field]: value });
    };

    // Sauvegarder les modifications
    const save = async (): Promise<boolean> => {
        if (!productId) return false;

        setSaving(true);
        try {
            // Mapper formData vers UpdateProductRequest
            const updateData: UpdateProductRequest = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                status: formData.status,
                primaryColorId: formData.primaryColorId,
                categoryId: formData.categoryId,
                sale: formData.sale,
                variants: formData.variants.map(v => ({
                    sizeId: v.sizeId,
                    stockCount: v.stockCount,
                    id: v.id,
                })),
                media: formData.media,
            };

            await updateProduct(productId, updateData);

            // Mettre à jour initialData après sauvegarde réussie
            setInitialData(formData);
            return true;
        } catch (error) {
            console.error("Error saving product:", error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    // Annuler les modifications
    const discardChanges = () => {
        if (initialData) {
            setFormData(initialData);
        }
    };

    if (!productId) {
        return null;
    }

    return {
        formData,
        hasChanges,
        saving,
        updateField,
        save,
        discardChanges,
    };
}

// Helpers
function mapStatusFromBackend(backendStatus: string): ProductStatus {
    const mapping: Record<string, ProductStatus> = {
        "Draft": "Draft",
        "Active": "Active",
        "Online": "Online",
        "Disabled": "Disabled",
    };
    return mapping[backendStatus] || "Draft";
}

function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
    if (originalPrice === 0) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}