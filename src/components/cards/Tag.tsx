import React from "react";

export const Tag = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {children}
    </span>
);
