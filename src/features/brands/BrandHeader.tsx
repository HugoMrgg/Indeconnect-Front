import { Heart, IdCard, MapPin} from "lucide-react";
import { Brand } from "@/types/brand";
import React from "react";
import { useBrandSubscription } from "@/hooks/useBrandSubscription";

interface Props {
    brand?: Brand;
}

export const BrandHeader: React.FC<Props> = ({ brand }) => {
    const { isSubscribed, loading, toggleSubscription } = useBrandSubscription(brand?.id);

    if (!brand) return null;

    return (
        <div className="flex justify-between my-8">
            {/* Infos marque */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>

                <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
                    {brand.description}
                </p>

                <div className="flex gap-2">
                    <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        <MapPin size={16} />
                        {brand.address}
                    </div>
                </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col gap-3 text-base">
                <button
                    onClick={toggleSubscription}
                    disabled={loading}
                    className="inline-flex gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Heart
                        className={`w-6 h-6 transition-all ${
                            isSubscribed ? "text-red-500 scale-110" : "text-gray-700"
                        }`}
                        fill={isSubscribed ? "currentColor" : "none"}
                    />
                    <span>{loading ? "..." : isSubscribed ? "Abonné ✓" : "S'abonner"}</span>
                </button>

                <button className="inline-flex gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition active:scale-[0.97]">
                    <IdCard className="w-6 h-6 text-gray-700" />
                    <span>Contact</span>
                </button>
            </div>
        </div>
    );
};
