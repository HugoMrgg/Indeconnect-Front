import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useOrder } from "@/hooks/Order/useOrder";
import { BrandDeliveryCard } from "@/features/order/BrandDeliveryCard";
import { OrderPageLayout } from "@/features/order/OrderPageLayout";
import { AlertCircle, Package, ArrowLeft, Home, ChevronRight, Calendar, Wallet } from "lucide-react";
import { OrderDetailsSkeleton } from "@/components/skeletons";
import { PaymentModal } from "@/features/checkout/PaymentModal";

export function OrderDetailsPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { tracking, loading, error, fetchTracking } = useOrder();

    const [activeBrandIndex, setActiveBrandIndex] = useState(0);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    useEffect(() => {
        if (!user || !orderId) {
            navigate("/");
            return;
        }

        const loadTracking = () => {
            fetchTracking(parseInt(orderId));
        };

        loadTracking();

        // Polling toutes les 30 secondes pour rafraîchir le statut
        const interval = setInterval(loadTracking, 30000);
        return () => clearInterval(interval);
    }, [orderId, user, navigate, fetchTracking]);

    if (loading) {
        return (
            <OrderPageLayout>
                <OrderDetailsSkeleton />
            </OrderPageLayout>
        );
    }

    if (error || !tracking) {
        return (
            <OrderPageLayout>
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                            <div>
                                <p className="text-red-800 font-medium mb-1">Erreur</p>
                                <p className="text-red-700 text-sm">{error || "Commande introuvable"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </OrderPageLayout>
        );
    }

    const globalEstimatedDate = tracking.latestEstimatedDelivery
        ? new Date(tracking.latestEstimatedDelivery).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : null;

    // Badge du statut global
    const getGlobalStatusBadge = () => {
        const statusConfig: Record<string, { label: string; color: string }> = {
            Pending: { label: "En attente", color: "bg-gray-100 text-gray-700" },
            Paid: { label: "Payée", color: "bg-green-100 text-green-700" },
            Processing: { label: "En traitement", color: "bg-blue-100 text-blue-700" },
            Delivered: { label: "Livrée", color: "bg-green-100 text-green-700" },
            Cancelled: { label: "Annulée", color: "bg-red-100 text-red-700" },
        };

        const config = statusConfig[tracking.globalStatus] || statusConfig.Pending;
        return (
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const currentDelivery = tracking.deliveriesByBrand[activeBrandIndex];

    return (
        <OrderPageLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                        <Home size={16} />
                        <span>Accueil</span>
                    </button>
                    <ChevronRight size={14} />
                    <button
                        onClick={() => navigate("/orders")}
                        className="hover:text-gray-900 transition-colors"
                    >
                        Mes commandes
                    </button>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium">Commande #{tracking.orderId}</span>
                </nav>

                {/* Header sticky avec info commande */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 sticky top-4 z-10 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-2">Commande #{tracking.orderId}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Package size={16} />
                                    <span>
                                        {new Date(tracking.placedAt).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="font-bold text-gray-900">
                                    Total : {tracking.totalAmount.toFixed(2)} €
                                </div>
                                {getGlobalStatusBadge()}
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/orders")}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                            <ArrowLeft size={18} />
                            <span className="hidden sm:inline">Retour</span>
                        </button>
                    </div>

                    {/* Bouton Payer si commande en attente */}
                    {tracking.globalStatus === "Pending" && (
                        <div className="mt-4 pt-4 border-t">
                            <button
                                onClick={() => setPaymentModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm"
                            >
                                <Wallet size={20} />
                                Payer maintenant
                            </button>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                Votre commande sera traitée dès réception du paiement
                            </p>
                        </div>
                    )}

                    {/* Estimation de livraison globale */}
                    {globalEstimatedDate && tracking.globalStatus !== "Delivered" && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Calendar className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-blue-900 font-semibold">
                                        Livraison complète estimée
                                    </p>
                                    <p className="text-blue-700 text-sm">{globalEstimatedDate}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Onglets des marques - Style segmented control iOS */}
                {tracking.deliveriesByBrand.length > 0 && (
                    <>
                        {tracking.deliveriesByBrand.length > 1 && (
                            <div className="bg-gradient-to-b from-gray-50 to-white py-4 mb-6">
                                <div className="mx-auto max-w-3xl px-4">
                                    <div className="bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                                        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                                            {tracking.deliveriesByBrand.map((delivery, index) => (
                                                <button
                                                    key={delivery.brandDeliveryId}
                                                    type="button"
                                                    onClick={() => setActiveBrandIndex(index)}
                                                    className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                                                        activeBrandIndex === index
                                                            ? "bg-white text-gray-900 shadow-sm"
                                                            : "text-gray-600 hover:text-gray-900"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        {delivery.brandLogoUrl && (
                                                            <img
                                                                src={delivery.brandLogoUrl}
                                                                alt={delivery.brandName}
                                                                className="w-5 h-5 object-contain rounded"
                                                            />
                                                        )}
                                                        <span>{delivery.brandName}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Affichage de la livraison sélectionnée */}
                        {currentDelivery ? (
                            <BrandDeliveryCard delivery={currentDelivery} />
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <p className="text-yellow-800">
                                    Les informations de livraison seront bientôt disponibles.
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Message si aucune livraison */}
                {tracking.deliveriesByBrand.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <p className="text-yellow-800">
                            Les informations de livraison seront bientôt disponibles.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de paiement */}
            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                orderId={tracking.orderId}
                onPaymentSuccess={() => {
                    setPaymentModalOpen(false);
                    // Recharger les données pour afficher le nouveau statut
                    fetchTracking(tracking.orderId);
                }}
            />
        </OrderPageLayout>
    );
}