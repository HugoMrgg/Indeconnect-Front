import React from "react";
import { Store, Shirt } from "lucide-react";

export const FloatingMenu = () => (
    <div className="fixed bottom-32 left-6 bg-black text-white rounded-2xl p-3 flex flex-col gap-3 shadow-xl border border-white/10">
        <button className="flex items-center gap-2 hover:text-yellow-400 transition">
            <Store size={18}/> IndeConnect
        </button>
        <button className="flex items-center gap-2 hover:text-yellow-400 transition">
            <Shirt size={18}/> Marques
        </button>
        <button className="flex items-center gap-2 hover:text-yellow-400 transition">
            <Shirt size={18}/> Vêtements
        </button>
    </div>
);

