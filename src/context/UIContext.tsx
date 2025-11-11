import React, { createContext, useCallback, useContext, useState } from "react";

type Scope = "global" | "brands" | "products";
type AuthMode = "login" | "register" | null;

interface UIContextType {
    scope: Scope;
    setScope: (scope: Scope) => void;

    // Filtres
    filtersOpen: boolean;
    toggleFilters: () => void;
    closeFilters: () => void;

    // Auth
    authOpen: boolean;
    authMode: AuthMode;
    openAuth: (mode: Exclude<AuthMode, null>) => void;
    closeAuth: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [scope, _setScope] = useState<UIContextType["scope"]>("global");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const setScope = useCallback((v: UIContextType["scope"]) => _setScope(v), []);
    const closeFilters = useCallback(() => setFiltersOpen(false), []);
    const toggleFilters = useCallback(() => setFiltersOpen(v => !v), []);

    // Auth
    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<AuthMode>(null);

    const openAuth = useCallback((mode: Exclude<AuthMode, null>) => {
        setAuthMode(mode);
        setAuthOpen(true);
    }, []);
    const closeAuth = useCallback(() => {
        setAuthOpen(false);
        setAuthMode(null);
    }, []);

    return (
        <UIContext.Provider value={{ scope, setScope,
                                     filtersOpen, toggleFilters, closeFilters,
                                     authOpen, authMode, openAuth, closeAuth}}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
    return ctx;
};