import React from "react";
import {Brand} from "../../../types/brand";


export const BrandCard = ({ name, city, description }: Brand) => {
    return (
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
    );
};

