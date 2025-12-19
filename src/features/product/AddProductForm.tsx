import React, { useState, useEffect } from "react";
import { Plus, Loader2, X, Upload, Image as ImageIcon, Package } from "lucide-react";
import { CreateProductRequest, ProductGroupSummaryDto } from "@/api/services/products/types";
import { fetchProductGroupsByBrand, createProductGroup } from "@/api/services/products";
import { imagesService } from "@/api/services/image";

interface AddProductFormProps {
    brandId: number;
    onSuccess: () => void;
    onCancel: () => void;
    onSubmit: (data: CreateProductRequest) => Promise<void>;
}

type CreationMode = "select" | "new-group" | "add-to-group";

// ✅ Liste des tailles disponibles
const AVAILABLE_SIZES = [
    { id: 1, name: "XS" },
    { id: 2, name: "S" },
    { id: 3, name: "M" },
    { id: 4, name: "L" },
    { id: 5, name: "XL" },
    { id: 6, name: "XXL" },
];

// ✅ Liste des couleurs disponibles
const AVAILABLE_COLORS = [
    { id: 1, name: "Noir", hexa: "#000000" },
    { id: 2, name: "Blanc", hexa: "#FFFFFF" },
    { id: 3, name: "Rouge", hexa: "#FF0000" },
    { id: 4, name: "Bleu", hexa: "#0000FF" },
    { id: 5, name: "Vert", hexa: "#00FF00" },
    { id: 6, name: "Jaune", hexa: "#FFFF00" },
];

export function AddProductForm({ brandId, onSuccess, onCancel, onSubmit }: AddProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [mode, setMode] = useState<CreationMode>("select");
    const [productGroups, setProductGroups] = useState<ProductGroupSummaryDto[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [loadingGroups, setLoadingGroups] = useState(false);

    // État pour les variantes de taille
    const [sizeVariants, setSizeVariants] = useState<Array<{
        sizeId: number;
        sizeName: string;
        stockCount: number;
    }>>([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        categoryId: 100,
        primaryColorId: null as number | null,
        media: [] as Array<{ url: string; type: "Image" | "Video"; displayOrder: number; isPrimary: boolean }>,
    });

    useEffect(() => {
        if (mode === "add-to-group") {
            loadProductGroups();
        }
    }, [mode]);

    const loadProductGroups = async () => {
        setLoadingGroups(true);
        try {
            const groups = await fetchProductGroupsByBrand(brandId);
            setProductGroups(groups);
            if (groups.length === 0) {
                setMode("select");
            }
        } catch (error) {
            console.error("Error loading product groups:", error);
            alert("Erreur lors du chargement des groupes de produits");
        } finally {
            setLoadingGroups(false);
        }
    };

    const handleGroupSelection = (groupId: number) => {
        setSelectedGroupId(groupId);
        const group = productGroups.find(g => g.id === groupId);
        if (group) {
            setFormData({
                ...formData,
                name: group.name,
                description: group.baseDescription,
                categoryId: group.categoryId,
            });
        }
    };

    const toggleSize = (sizeId: number, sizeName: string) => {
        const exists = sizeVariants.find(v => v.sizeId === sizeId);
        if (exists) {
            setSizeVariants(sizeVariants.filter(v => v.sizeId !== sizeId));
        } else {
            setSizeVariants([...sizeVariants, { sizeId, sizeName, stockCount: 0 }]);
        }
    };

    const updateSizeStock = (sizeId: number, stockCount: number) => {
        setSizeVariants(sizeVariants.map(v =>
            v.sizeId === sizeId ? { ...v, stockCount } : v
        ));
    };

    // ✅ NOUVEAU : Upload d'image via Cloudinary
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);

        try {
            const cloudinaryUrl = await imagesService.uploadImage(file, {
                maxSizeMB: 10,
                allowedFormats: ["image/jpeg", "image/png", "image/webp"]
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
            console.error("Erreur upload:", err);
            alert("Erreur lors de l'upload de l'image");
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (index: number) => {
        const updatedMedia = formData.media.filter((_, i) => i !== index);
        if (updatedMedia.length > 0 && !updatedMedia.some(m => m.isPrimary)) {
            updatedMedia[0].isPrimary = true;
        }
        setFormData({ ...formData, media: updatedMedia });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.description || formData.price <= 0) {
            alert("Veuillez remplir tous les champs obligatoires");
            return;
        }

        if (!formData.primaryColorId) {
            alert("Veuillez sélectionner une couleur");
            return;
        }

        if (sizeVariants.length === 0) {
            alert("Veuillez ajouter au moins une taille");
            return;
        }

        if (formData.media.length === 0) {
            alert("Veuillez ajouter au moins une image");
            return;
        }

        setLoading(true);

        try {
            let targetGroupId = selectedGroupId;

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

            const colorCode = AVAILABLE_COLORS.find(c => c.id === formData.primaryColorId)?.name.substring(0, 1).toUpperCase() || "X";
            const variants = sizeVariants.map(v => ({
                sku: `${formData.name.substring(0, 3).toUpperCase()}-${colorCode}-${v.sizeName}`,
                size: {
                    id: v.sizeId,
                    name: v.sizeName,
                },
                stockCount: v.stockCount,
                price: formData.price,
                isAvailable: v.stockCount > 0,
            }));

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

            await onSubmit(request);
            onSuccess();
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Erreur lors de la création du produit");
        } finally {
            setLoading(false);
        }
    };

    // Écran de sélection du mode
    if (mode === "select") {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Créer un produit</h2>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-8">
                        Choisissez comment vous souhaitez créer votre produit
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <button
                            onClick={() => setMode("new-group")}
                            className="group p-6 border-2 border-gray-200 hover:border-blue-500 rounded-xl transition-all hover:shadow-lg"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition">
                                <Plus size={32} className="text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Nouveau type de produit</h3>
                            <p className="text-sm text-gray-600">
                                Créer un nouveau produit avec toutes ses informations
                            </p>
                        </button>

                        <button
                            onClick={() => setMode("add-to-group")}
                            className="group p-6 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all hover:shadow-lg"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition">
                                <Package size={32} className="text-green-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Ajouter une couleur</h3>
                            <p className="text-sm text-gray-600">
                                Ajouter une variante de couleur à un produit existant
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Formulaire principal
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full my-8 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b z-10">
                    <div>
                        <button
                            onClick={() => setMode("select")}
                            className="text-sm text-gray-600 hover:text-gray-800 mb-2 flex items-center gap-1"
                        >
                            ← Retour
                        </button>
                        <h2 className="text-2xl font-bold">
                            {mode === "new-group" ? "Nouveau type de produit" : "Ajouter une couleur"}
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
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Sélectionner le groupe de produit</h3>
                            {loadingGroups ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="animate-spin" size={32} />
                                </div>
                            ) : (
                                <select
                                    value={selectedGroupId || ""}
                                    onChange={(e) => handleGroupSelection(parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    required
                                >
                                    <option value="">Choisissez un groupe de produit</option>
                                    {productGroups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name} ({group.productCount} couleur{group.productCount > 1 ? 's' : ''})
                                        </option>
                                    ))}
                                </select>
                            )}

                            {selectedGroupId && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <strong>Description du groupe :</strong>{" "}
                                        {productGroups.find(g => g.id === selectedGroupId)?.baseDescription}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Informations de base (mode new-group) */}
                    {mode === "new-group" && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Informations générales</h3>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nom du produit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ex: T-shirt Streetwear"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={4}
                                    placeholder="Décrivez votre produit..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Catégorie <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value={100}>Vêtements</option>
                                    <option value={101}>Accessoires</option>
                                    <option value={102}>Chaussures</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Sélection de la couleur */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Couleur de cette variante</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {AVAILABLE_COLORS.map((color) => (
                                <button
                                    key={color.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, primaryColorId: color.id })}
                                    className={`p-3 border-2 rounded-lg flex items-center gap-3 transition ${
                                        formData.primaryColorId === color.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                                        style={{ backgroundColor: color.hexa }}
                                    />
                                    <span className="text-sm font-medium">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Prix */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">
                            {mode === "new-group" ? "Prix de base" : "Prix de cette couleur"}
                        </h3>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Prix (€) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    {/* Tailles et stocks */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Tailles et stocks</h3>
                        <p className="text-sm text-gray-600">Sélectionnez les tailles disponibles et définissez leurs stocks</p>

                        <div className="space-y-3">
                            {AVAILABLE_SIZES.map((size) => {
                                const variant = sizeVariants.find(v => v.sizeId === size.id);
                                const isSelected = !!variant;

                                return (
                                    <div key={size.id} className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleSize(size.id, size.name)}
                                            className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                                                isSelected
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            {size.name}
                                        </button>

                                        {isSelected && (
                                            <div className="flex-1 flex items-center gap-2">
                                                <label className="text-sm font-medium">Stock:</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={variant.stockCount}
                                                    onChange={(e) => updateSizeStock(size.id, parseInt(e.target.value) || 0)}
                                                    className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                                <span className="text-sm text-gray-600">unités</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ✅ NOUVEAU : Upload d'images */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <ImageIcon size={20} />
                            Images de cette variante
                        </h3>

                        <div className="flex flex-col gap-4">
                            <label className="cursor-pointer">
                                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    {uploadingImage ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Upload en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={18} />
                                            Choisir une image
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                    className="hidden"
                                />
                            </label>

                            {formData.media.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {formData.media.map((media, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={media.url}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            {media.isPrimary && (
                                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                    Principale
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Création...
                                </>
                            ) : (
                                "Créer le produit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}