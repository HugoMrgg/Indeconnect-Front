/*
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type UIScope = "global" | "brands" | "products";

interface UIContextType {
    scope: UIScope;
    setScope: (scope: UIScope) => void;

    filtersOpen: boolean;
    toggleFilters: () => void;
    closeFilters: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [scopeState, setScopeState] = useState<UIScope>("global");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const setScope = useCallback((v: UIScope) => setScopeState(v), []);
    const closeFilters = useCallback(() => setFiltersOpen(false), []);
    const toggleFilters = useCallback(() => setFiltersOpen(v => !v), []);

    const value = useMemo<UIContextType>(() => ({
        scope: scopeState,
        setScope,
        filtersOpen,
        toggleFilters,
        closeFilters,
    }), [scopeState, setScope, filtersOpen, toggleFilters, closeFilters]);

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
    return ctx;
};
*/
import React, { createContext, useCallback, useContext, useState } from "react";

interface UIContextType {
    scope: "global" | "brands" | "products";
    setScope: (scope: "global" | "brands" | "products") => void;

    filtersOpen: boolean;
    toggleFilters: () => void;
    closeFilters: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [scope, _setScope] = useState<UIContextType["scope"]>("global");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const setScope = useCallback((v: UIContextType["scope"]) => _setScope(v), []);
    const closeFilters = useCallback(() => setFiltersOpen(false), []);
    const toggleFilters = useCallback(() => setFiltersOpen(v => !v), []);

    return (
        <UIContext.Provider value={{ scope, setScope, filtersOpen, toggleFilters, closeFilters }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
    return ctx;
};