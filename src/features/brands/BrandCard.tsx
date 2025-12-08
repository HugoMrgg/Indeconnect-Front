import React from "react";
import { useNavigate } from "react-router-dom";
import { Brand } from "@/types/brand";
import { Star, MapPin } from "lucide-react";

export const BrandCard: React.FC<Brand> = ({
                                               name,
                                               logoUrl,
                                               description,
                                               ethicsScoreProduction,
                                               ethicsScoreTransport,
                                               address,
                                               distanceKm,
                                               userRating,
                                           }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/brand/${encodeURIComponent(name)}`)}
            className="flex flex-col cursor-pointer min-w-96 max-w-96 min-h-56 p-4 border rounded-2xl shadow-sm hover:shadow-md transition bg-white hover:-translate-y-1"
        >
            <div className="flex space-x-3">
                <img
                    src={logoUrl}
                    alt={`${name} logo`}
                    className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-1">{name}</h3>
                    <div className="flex items-center text-yellow-500 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={i < Math.floor(userRating ?? 0) ? "currentColor" : "none"}
                            />
                        ))}
                        <span className="ml-1 text-gray-600">{userRating !== undefined ? userRating.toFixed(1) : "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div className="bg-gray-50 p-2 rounded-xl">
                    <p className="text-gray-500 text-xs">Éthique (production)</p>
                    <p className="font-semibold">{(ethicsScoreProduction/60).toFixed(1)} / 5</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl">
                    <p className="text-gray-500 text-xs">Éthique (transport)</p>
                    <p className="font-semibold">{(ethicsScoreTransport/60).toFixed(1)} / 5</p>
                </div>
            </div>

            <p className="text-sm my-2 text-gray-700 line-clamp-3">{description}</p>

            <div className="flex flex-wrap mt-auto gap-2 text-xs">
                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  {address}
                </span>
                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <MapPin size={16}/> {distanceKm !== undefined ? Math.round(distanceKm) : "?"} km
                </span>
            </div>
        </div>
    );
};
