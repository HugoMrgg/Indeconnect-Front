import React, { useState, useCallback } from "react";
import { BrandPage } from "@/pages/brands/Brand";
import { AddProductForm } from "@/features/product/AddProductForm";
import { createProduct } from "@/api/services/products";
import { CreateProductRequest } from "@/api/services/products/types";
import { Brand } from "@/types/brand";

interface MyBrandProductsTabProps {
    brand: Brand;
    onUpdateField: any;
    onRefetch: () => void;
}

export function MyBrandProductsTab({ brand, onUpdateField, onRefetch }: MyBrandProductsTabProps) {
    const [showAddProduct, setShowAddProduct] = useState(false);

    const handleCreateProduct = useCallback(
        async (data: CreateProductRequest) => {
            try {
                await createProduct(data);
                setShowAddProduct(false);
                // Petit délai pour une meilleure UX avant le refresh
                setTimeout(() => {
                    onRefetch();
                }, 300);
            } catch (error) {
                console.error("Error creating product:", error);
                throw error;
            }
        },
        [onRefetch]
    );

    return (
        <>
            <BrandPage
                brandId={brand.id}
                brandData={brand}
                editMode={true}
                onUpdateField={onUpdateField}
                onAddProduct={() => setShowAddProduct(true)}
            />

            {/* Modal d'ajout de produit */}
            {showAddProduct && (
                <AddProductForm
                    brandId={brand.id}
                    onSuccess={() => {
                        // La fermeture est gérée dans handleCreateProduct
                    }}
                    onCancel={() => setShowAddProduct(false)}
                    onSubmit={handleCreateProduct}
                />
            )}
        </>
    );
}
