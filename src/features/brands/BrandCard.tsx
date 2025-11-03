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

export const BrandCard: React.FC<Brand> = ({ name, city, description }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/brand/${encodeURIComponent(name)}`)}
            className="cursor-pointer w-64 p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white hover:-translate-y-1"
        >
            <h3 className="text-lg font-semibold mb-1">{name}</h3>
            <p className="text-sm text-gray-500 mb-2">{city}</p>
            <p className="text-sm text-gray-700 line-clamp-3">{description}</p>
        </div>
    );
};
