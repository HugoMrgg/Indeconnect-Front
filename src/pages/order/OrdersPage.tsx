import { useEffect } from "react";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useOrder } from "@/hooks/Order/useOrder";
import { OrderCard } from "@/features/order/OrderCard";
import { OrderPageLayout } from "@/features/order/OrderPageLayout";
import { Loader2, Package, AlertCircle, Home, ChevronRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OrdersPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { orders, loading, error, fetchUserOrders } = useOrder();

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        fetchUserOrders(user.id);
    }, [user, fetchUserOrders, navigate]);

    // État de chargement
    if (loading) {
        return (
            <OrderPageLayout>
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-gray-400" size={48} />
                    </div>
                </div>
            </OrderPageLayout>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <OrderPageLayout>
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                            <div>
                                <p className="text-red-800 font-medium mb-1">Erreur de chargement</p>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </OrderPageLayout>
        );
    }

    // Aucune commande
    if (orders.length === 0) {
        return (
            <OrderPageLayout>
                <div className="max-w-5xl mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <button onClick={() => navigate("/")} className="hover:text-gray-900 transition-colors flex items-center gap-1">
                            <Home size={16} />
                            <span>Accueil</span>
                        </button>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-medium">Mes commandes</span>
                    </nav>

                    <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="text-gray-400" size={40} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Aucune commande
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Vous n'avez pas encore passé de commande
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                        >
                            <ShoppingBag size={18} />
                            Découvrir nos produits
                        </button>
                    </div>
                </div>
            </OrderPageLayout>
        );
    }

    // Liste des commandes
    return (
        <OrderPageLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <button onClick={() => navigate("/")} className="hover:text-gray-900 transition-colors flex items-center gap-1">
                        <Home size={16} />
                        <span>Accueil</span>
                    </button>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium">Mes commandes</span>
                </nav>

                {/* Header avec stats */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Mes commandes</h1>
                            <p className="text-gray-600 flex items-center gap-2">
                                <Package size={18} />
                                {orders.length} commande{orders.length > 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="hidden sm:block w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <ShoppingBag className="text-white" size={32} />
                        </div>
                    </div>
                </div>

                {/* Liste des commandes */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </div>
        </OrderPageLayout>
    );
}