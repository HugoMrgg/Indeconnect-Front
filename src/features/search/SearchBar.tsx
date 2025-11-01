import React from "react";

export const SearchBar = () => (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-96 bg-black/90 backdrop-blur-md text-white rounded-full px-5 py-3 flex items-center gap-3 shadow-2xl border border-white/10">
        <input
            type="text"
            placeholder="Search what you want"
            className="bg-transparent w-full outline-none placeholder-gray-400"
        />
    </div>
);
