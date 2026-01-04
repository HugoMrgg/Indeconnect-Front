import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { ProductGroupSummaryDto, CreateProductRequest } from "@/api/services/products/types";
import { fetchProductGroupsByBrand } from "@/api/services/products";
import { imagesService } from "@/api/services/image";
import { useProductCreation } from "@/hooks/Product/useProductCreation";
import { useSizes } from "@/hooks/Sizes/useSizes";
import { logger } from "@/utils/logger";
import { useTranslation } from "react-i18next";

// Sous-composants
import { AddProductModeSelection } from "./AddProductModeSelection";
import { AddProductGroupSelector } from "./AddProductGroupSelector";
import { AddProductBasicInfo } from "./AddProductBasicInfo";
import { AddProductCategorySelector } from "./AddProductCategorySelector";
import { AddProductColorSelector } from "./AddProductColorSelector";
import { AddProductSizeVariants } from "./AddProductSizeVariants";
import { AddProductImageUpload } from "./AddProductImageUpload";

interface AddProductFormProps {
    brandId: number;
    onSuccess: () => void;
    onCancel: () => void;
    onSubmit: (data: CreateProductRequest) => Promise<void>;
}

type CreationMode = "select" | "new-group" | "add-to-group";

export function AddProductForm({ brandId, onSuccess, onCancel }: AddProductFormProps) {
    const { t } = useTranslation();
    const { createNewProduct, loading: creationLoading } = useProductCreation();

    // États principaux
    const [mode, setMode] = useState<CreationMode>("select");
    const [uploadingImage, setUploadingImage] = useState(false);

    // États pour les groupes de produits
    const [productGroups, setProductGroups] = useState<ProductGroupSummaryDto[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [loadingGroups, setLoadingGroups] = useState(false);

    // État du formulaire
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        categoryId: null as number | null,
        primaryColorId: null as number | null,
        media: [] as Array<{
            url: string;
            type: "Image" | "Video";
            displayOrder: number;
            isPrimary: boolean;
        }>,
    });

    // Variantes de taille
    const [sizeVariants, setSizeVariants] = useState<
        Array<{
            sizeId: number;
            sizeName: string;
            stockCount: number;
        }>
    >([]);

    // Hook pour charger les tailles selon la catégorie sélectionnée
    const {
        sizes: availableSizes,
        loading: loadingSizes,
        error: errorSizes,
    } = useSizes(formData.categoryId);

    // Charger les groupes de produits quand on passe en mode "add-to-group"
    useEffect(() => {
        if (mode === "add-to-group") {
            loadProductGroups();
        }
    }, [mode]);

    // Réinitialiser les tailles sélectionnées quand la catégorie change
    useEffect(() => {
        setSizeVariants([]);
    }, [formData.categoryId]);

    const loadProductGroups = async () => {
        setLoadingGroups(true);
        try {
            const groups = await fetchProductGroupsByBrand(brandId);
            setProductGroups(groups);
            if (groups.length === 0) {
                alert(t('products.add_product.no_product_groups'));
                setMode("select");
            }
        } catch (error) {
            logger.error("AddProductForm.loadGroups", error);
            alert(t('products.add_product.error_loading_groups'));
            setMode("select");
        } finally {
            setLoadingGroups(false);
        }
    };

    // Gestion de la sélection de groupe
    const handleGroupSelection = (groupId: number) => {
        setSelectedGroupId(groupId);
        const group = productGroups.find((g) => g.id === groupId);
        if (group) {
            setFormData({
                ...formData,
                name: group.name,
                description: group.baseDescription,
                categoryId: group.categoryId,
            });
        }
    };

    // Gestion de la sélection de catégorie
    const handleCategorySelection = (categoryId: number) => {
        setFormData({
            ...formData,
            categoryId,
        });
    };

    // Gestion des tailles
    const toggleSize = (sizeId: number, sizeName: string) => {
        const exists = sizeVariants.find((v) => v.sizeId === sizeId);
        if (exists) {
            setSizeVariants(sizeVariants.filter((v) => v.sizeId !== sizeId));
        } else {
            setSizeVariants([...sizeVariants, { sizeId, sizeName, stockCount: 0 }]);
        }
    };

    const updateSizeStock = (sizeId: number, stockCount: number) => {
        setSizeVariants(
            sizeVariants.map((v) => (v.sizeId === sizeId ? { ...v, stockCount } : v))
        );
    };

    // Upload d'image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);

        try {
            const cloudinaryUrl = await imagesService.uploadImage(file, {
                maxSizeMB: 10,
                allowedFormats: ["image/jpeg", "image/png", "image/webp"],
            });

            const newMedia = {
                url: cloudinaryUrl,
                type: "Image" as const,
                displayOrder: formData.media.length,
                isPrimary: formData.media.length === 0,
            };

            setFormData({
                ...formData,
                media: [...formData.media, newMedia],
            });
        } catch (err) {
            logger.error("AddProductForm.uploadImage", err);
            alert(t('products.add_product.error_image_upload'));
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (index: number) => {
        const updatedMedia = formData.media.filter((_, i) => i !== index);
        if (updatedMedia.length > 0 && !updatedMedia.some((m) => m.isPrimary)) {
            updatedMedia[0].isPrimary = true;
        }
        setFormData({ ...formData, media: updatedMedia });
    };

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.categoryId) {
            alert(t('products.add_product.error_no_category'));
            return;
        }

        if (!formData.primaryColorId) {
            alert(t('products.add_product.error_no_color'));
            return;
        }

        if (sizeVariants.length === 0) {
            alert(t('products.add_product.error_no_size'));
            return;
        }

        try {
            await createNewProduct({
                brandId,
                mode: mode as "new-group" | "add-to-group",
                selectedGroupId,
                formData: {
                    ...formData,
                    categoryId: formData.categoryId!, // On sait qu'il est défini maintenant
                },
                sizeVariants,
            });

            onSuccess();
        } catch (error) {
            logger.error("AddProductForm.handleSubmit", error);
            alert(error instanceof Error ? error.message : t('products.add_product.error_creating_product'));
        }
    };

    // Écran de sélection du mode
    if (mode === "select") {
        return <AddProductModeSelection onSelectMode={setMode} onCancel={onCancel} />;
    }

    // Formulaire principal
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full my-8 p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b z-10">
                    <div>
                        <button
                            onClick={() => setMode("select")}
                            className="text-sm text-gray-600 hover:text-gray-800 mb-2 flex items-center gap-1"
                        >
                            ← {t('common.back')}
                        </button>
                        <h2 className="text-2xl font-bold">
                            {mode === "new-group"
                                ? t('products.add_product.mode_new_type')
                                : t('products.add_product.mode_add_color')}
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sélection du groupe (mode add-to-group) */}
                    {mode === "add-to-group" && (
                        <AddProductGroupSelector
                            productGroups={productGroups}
                            selectedGroupId={selectedGroupId}
                            loading={loadingGroups}
                            onSelectGroup={handleGroupSelection}
                        />
                    )}

                    {/* Informations de base + Catégorie (mode new-group) */}
                    {mode === "new-group" && (
                        <>
                            <AddProductBasicInfo
                                formData={formData}
                                onUpdateField={(field, value) =>
                                    setFormData({ ...formData, [field]: value })
                                }
                            />

                            <AddProductCategorySelector
                                selectedCategoryId={formData.categoryId}
                                onSelectCategory={handleCategorySelection}
                            />
                        </>
                    )}

                    {/* Afficher la catégorie en lecture seule en mode add-to-group */}
                    {mode === "add-to-group" && selectedGroupId && formData.categoryId && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>{t('products.add_product.category_label')}</strong> {t('products.add_product.category_inherited')}
                            </p>
                        </div>
                    )}

                    {/* Sélection de la couleur */}
                    <AddProductColorSelector
                        selectedColorId={formData.primaryColorId}
                        onSelectColor={(colorId) =>
                            setFormData({ ...formData, primaryColorId: colorId })
                        }
                    />

                    {/* Prix */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">
                            {mode === "new-group" ? t('products.details.base_price') : t('products.details.color_price')}
                        </h3>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t('products.add_product.price_label')}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder={t('products.add_product.price_placeholder')}
                                required
                            />
                        </div>
                    </div>

                    {/* Tailles et stocks */}
                    <AddProductSizeVariants
                        categoryId={formData.categoryId}
                        availableSizes={availableSizes}
                        loadingSizes={loadingSizes}
                        errorSizes={errorSizes}
                        sizeVariants={sizeVariants}
                        onToggleSize={toggleSize}
                        onUpdateStock={updateSizeStock}
                    />

                    {/* Upload d'images */}
                    <AddProductImageUpload
                        media={formData.media}
                        uploading={uploadingImage}
                        onImageSelect={handleImageUpload}
                        onRemoveImage={removeImage}
                    />

                    {/* Boutons d'action */}
                    <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={creationLoading || uploadingImage}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {creationLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    {t('products.add_product.submitting')}
                                </>
                            ) : (
                                t('products.add_product.submit_button')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}