import React from "react";
import { ShippingMethodsManager } from "@/features/checkout/ShippingMethodsManager";

interface MyBrandShippingTabProps {
    brandId: number;
}

export function MyBrandShippingTab({ brandId }: MyBrandShippingTabProps) {
    return (
        <div className="min-h-full bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                    <ShippingMethodsManager brandId={brandId} editMode={true} />
                </div>
            </div>
        </div>
    );
}
