import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/Auth/useAuth";
import { createProduct } from "@/api/services/products";

export function ProductCreatePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const brandIdFromUrl = params.get("brandId");
    const [brandId, setBrandId] = useState<number>(brandIdFromUrl ? Number(brandIdFromUrl) : 0);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [primaryColorId, setPrimaryColorId] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [keywords, setKeywords] = useState("");

    const canManage =
        user?.role === "Vendor" ||
        user?.role === "SuperVendor" ||
        user?.role === "Administrator";

    if (!canManage) return null;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const payload = {
                name,
                description,
                price,
                brandId,
                categoryId,
                primaryColorId,
                media: [],
                sizeVariants: [],
                details: [],
                keywords: keywords
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
            };

            await createProduct(payload);
            toast.success("Produit créé ✨");
            navigate(-1);
        } catch {
            toast.error("Impossible de créer le produit.");
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-semibold mb-6">Créer un produit</h1>

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nom</label>
                    <input className="w-full border rounded-xl px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea className="w-full border rounded-xl px-3 py-2 min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Prix</label>
                        <input type="number" min={0} step="0.01" className="w-full border rounded-xl px-3 py-2"
                               value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">BrandId</label>
                        <input type="number" className="w-full border rounded-xl px-3 py-2"
                               value={brandId} onChange={(e) => setBrandId(Number(e.target.value))} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">CategoryId</label>
                        <input type="number" className="w-full border rounded-xl px-3 py-2"
                               value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">PrimaryColorId (optionnel)</label>
                        <input type="number" className="w-full border rounded-xl px-3 py-2"
                               value={primaryColorId ?? ""} onChange={(e) => setPrimaryColorId(e.target.value === "" ? null : Number(e.target.value))} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Mots-clés (séparés par des virgules)</label>
                    <input className="w-full border rounded-xl px-3 py-2"
                           value={keywords} onChange={(e) => setKeywords(e.target.value)}
                           placeholder="pull, hiver, coton" />
                </div>

                <button className="rounded-2xl bg-black text-white px-4 py-2 hover:bg-gray-900 transition">
                    Créer
                </button>
            </form>
        </div>
    );
}
