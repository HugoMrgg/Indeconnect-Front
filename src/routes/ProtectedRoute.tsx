import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: UserRole[];
}

/**
 * Composant pour protéger les routes
 * - Redirige vers "/" si pas authentifié
 * - Redirige vers "/" si pas les permissions
 */
export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
    const { isAuthenticated, userRole, isLoading } = useAuth();

    // Loading → Afficher un spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    // Pas authentifié → Rediriger
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Vérifier les rôles requis
    if (requiredRoles && !requiredRoles.includes(userRole as UserRole)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
