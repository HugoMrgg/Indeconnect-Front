import { useState, useCallback } from "react";
import { createProduct, createProductGroup } from "@/api/services/products";
import { CreateProductRequest } from "@/api/services/products/types";

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    primaryColorId: number | null;
    media: Array<{
        url: string;
        type: "Image" | "Video";
        displayOrder: number;
        isPrimary: boolean;
    }>;
}

interface SizeVariant {
    sizeId: number;
    sizeName: string;
    stockCount: number;
}

interface CreateProductOptions {
    brandId: number;
    mode: "new-group" | "add-to-group";
    selectedGroupId: number | null;
    formData: ProductFormData;
    sizeVariants: SizeVariant[];
}

interface UseProductCreationReturn {
    createNewProduct: (options: CreateProductOptions) => Promise<void>;
    loading: boolean;
    error: string | null;
}

// Liste des couleurs disponibles (pourrait être déplacé dans un fichier de constants)
const AVAILABLE_COLORS = [
    { id: 1, name: "Noir", hexa: "#000000" },
    { id: 2, name: "Blanc", hexa: "#FFFFFF" },
    { id: 3, name: "Rouge", hexa: "#FF0000" },
    { id: 4, name: "Bleu", hexa: "#0000FF" },
    { id: 5, name: "Vert", hexa: "#00FF00" },
    { id: 6, name: "Jaune", hexa: "#FFFF00" },
];

/**
 * Hook pour gérer la création de produits
 * Encapsule la logique métier : validation, création de group, construction des variants
 */
export function useProductCreation(): UseProductCreationReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createNewProduct = useCallback(
        async (options: CreateProductOptions) => {
            const { brandId, mode, selectedGroupId, formData, sizeVariants } = options;

            // Validation métier
            if (!formData.name || !formData.description || formData.price <= 0) {
                throw new Error("Veuillez remplir tous les champs obligatoires");
            }

            if (!formData.primaryColorId) {
                throw new Error("Veuillez sélectionner une couleur");
            }

            if (sizeVariants.length === 0) {
                throw new Error("Veuillez ajouter au moins une taille");
            }

            if (formData.media.length === 0) {
                throw new Error("Veuillez ajouter au moins une image");
            }

            setLoading(true);
            setError(null);

            try {
                let targetGroupId = selectedGroupId;

                // Créer un nouveau group si nécessaire
                if (mode === "new-group") {
                    const newGroup = await createProductGroup({
                        name: formData.name,
                        baseDescription: formData.description,
                        categoryId: formData.categoryId,
                    });
                    targetGroupId = newGroup.id;
                }

                if (!targetGroupId) {
                    throw new Error("Product group ID is missing");
                }

                // Construction du code couleur pour le SKU
                const colorCode =
                    AVAILABLE_COLORS.find((c) => c.id === formData.primaryColorId)
                        ?.name.substring(0, 1)
                        .toUpperCase() || "X";

                // Construction des variants avec SKU
                const variants = sizeVariants.map((v) => ({
                    sku: `${formData.name.substring(0, 3).toUpperCase()}-${colorCode}-${v.sizeName}`,
                    size: {
                        id: v.sizeId,
                        name: v.sizeName,
                    },
                    stockCount: v.stockCount,
                    price: formData.price,
                    isAvailable: v.stockCount > 0,
                }));

                // Construction de la requête de création
                const request: CreateProductRequest = {
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    brandId: brandId,
                    categoryId: formData.categoryId,
                    productGroupId: targetGroupId,
                    primaryColorId: formData.primaryColorId,
                    media: formData.media,
                    sizeVariants: variants,
                    details: [],
                    keywords: [],
                    status: "Online",
                };

                // Appel API
                await createProduct(request);
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Erreur lors de la création du produit";
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        createNewProduct,
        loading,
        error,
    };
}
