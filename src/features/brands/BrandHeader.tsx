import { Heart, IdCard, MapPin} from "lucide-react";
import { Brand } from "@/types/brand";
import React from "react";

interface Props {
    brand?: Brand;
    subscribed: boolean;
    onToggleSubscribe: () => void;
}

export const BrandHeader: React.FC<Props> = ({ brand, subscribed, onToggleSubscribe }) => {
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
                    onClick={onToggleSubscribe}
                    className="inline-flex gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition active:scale-[0.97]"
                >
                    <Heart
                        className={`w-6 h-6 transition-all ${subscribed ? "text-red-500 scale-110" : "text-gray-700"}`}
                        fill={subscribed ? "currentColor" : "none"}
                    />
                    <span>{subscribed ? "Abonné ✓" : "S'abonner"}</span>
                </button>

                <button className="inline-flex gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition active:scale-[0.97]">
                    <IdCard className="w-6 h-6 text-gray-700" />
                    <span>Contact</span>
                </button>
            </div>
        </div>
    );
};
