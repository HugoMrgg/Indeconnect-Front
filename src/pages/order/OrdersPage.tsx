import { useEffect } from "react";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useOrder } from "@/hooks/Order/useOrder";
import { OrderCard } from "@/features/order/OrderCard";
import { Loader2, Package, AlertCircle } from "lucide-react";
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
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-gray-400" size={48} />
                    </div>
                </div>
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4">
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
            </div>
        );
    }

    // Aucune commande
    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Package className="mx-auto text-gray-400 mb-4" size={64} />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Aucune commande
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Vous n'avez pas encore passé de commande
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Découvrir nos produits
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Liste des commandes
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Mes commandes</h1>
                    <p className="text-gray-600">
                        {orders.length} commande{orders.length > 1 ? "s" : ""}
                    </p>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </div>
        </div>
    );
}