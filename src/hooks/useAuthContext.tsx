import { useContext } from "react";
import { AuthContext, type AuthContextType } from "@/context/AuthContext";

/**
 * Hook pour accéder au contexte d'authentification
 * @throws Error si utilisé en dehors de AuthProvider
 */
export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("[useAuthContext] Doit être utilisé dans <AuthProvider>");
    }

    return context;
}
