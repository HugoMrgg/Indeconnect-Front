/*
import React from "react";
import {Brand} from "@/types/brand";
import {Link} from "react-router-dom";


export const BrandCard = ({ name, city, description }: Brand) => {
    return (
        <Link to={`/brand/${product.brandId || '6k-skateshop'}`} className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden font-poppins">
            <div className="bg-white rounded-2xl shadow-card hover:shadow-xl transition-all w-72 p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{description}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
              {city}
            </span>
                    <button className="text-gray-400 hover:text-black transition">→</button>
                </div>
            </div>
        </Link>
    );
};

*/
import React from "react";
import { useNavigate } from "react-router-dom";
import { Brand } from "@/types/brand";
import { Star, MapPin } from "lucide-react";

export const BrandCard: React.FC<Brand> = ({
                                               name,
                                               city,
                                               description,
                                               distance_km,
                                               rating,
                                               ethical_prod,
                                               ethical_transports,
                                               transport,
                                               logo_url }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/brand/${encodeURIComponent(name)}`)}
            className="flex flex-col cursor-pointer min-w-96 max-w-96 min-h-56 p-4 border rounded-2xl shadow-sm hover:shadow-md transition bg-white hover:-translate-y-1"
        >
            <div className="flex space-x-3">
                <img
                    src={logo_url}
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
                                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                            />
                        ))}
                        <span className="ml-1 text-gray-600">{rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div className="bg-gray-50 p-2 rounded-xl">
                    <p className="text-gray-500 text-xs">Éthique (production)</p>
                    <p className="font-semibold">{ethical_prod} / 5</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl">
                    <p className="text-gray-500 text-xs">Éthique (transport)</p>
                    <p className="font-semibold">{ethical_transports} / 5</p>
                </div>
            </div>

            <p className="text-sm my-2 text-gray-700 line-clamp-3">{description}</p>

            <div className="flex flex-wrap mt-auto gap-2 text-xs">
                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  {city}
                </span>
                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <MapPin size={16}/> {Math.round(distance_km)} km
                </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    {transport}
                </span>
            </div>
        </div>
    );
};
