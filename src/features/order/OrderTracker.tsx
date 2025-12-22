import { TrackingStepDto } from "@/api/services/orders/types";
import { Check, Loader2, ShoppingCart, CreditCard, Package, Truck, Home, CheckCircle2 } from "lucide-react";

type Props = {
    timeline: TrackingStepDto[];
};

// Fonction pour obtenir l'icône selon le statut
const getStepIcon = (status: string) => {
    switch (status) {
        case "Pending":
            return ShoppingCart;
        case "Paid":
            return CreditCard;
        case "Processing":
            return Package;
        case "Shipped":
            return Truck;
        case "Delivered":
            return Home;
        default:
            return CheckCircle2;
    }
};

// Fonction pour obtenir la couleur selon le statut
const getStepColor = (isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return {
        bg: "bg-green-500",
        border: "border-green-500",
        text: "text-white",
        line: "bg-green-500"
    };
    if (isCurrent) return {
        bg: "bg-blue-500",
        border: "border-blue-500",
        text: "text-white",
        line: "bg-gray-300"
    };
    return {
        bg: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-400",
        line: "bg-gray-300"
    };
};

export function OrderTracker({ timeline }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
                <Package className="text-gray-700" size={24} />
                <h2 className="text-xl font-bold">Suivi de commande</h2>
            </div>

            <div className="space-y-2">
                {timeline.map((step, index) => {
                    const isLast = index === timeline.length - 1;
                    const Icon = getStepIcon(step.status);
                    const colors = getStepColor(step.isCompleted, step.isCurrent);

                    return (
                        <div key={step.status} className="flex gap-4">
                            {/* Icône */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        colors.bg
                                    } ${colors.border} ${step.isCurrent ? "animate-pulse shadow-lg" : "shadow-md"}`}
                                >
                                    {step.isCompleted ? (
                                        <Check className={colors.text} size={24} strokeWidth={3} />
                                    ) : step.isCurrent ? (
                                        <Loader2 className={`${colors.text} animate-spin`} size={24} />
                                    ) : (
                                        <Icon className={colors.text} size={24} />
                                    )}
                                </div>

                                {/* Ligne verticale */}
                                {!isLast && (
                                    <div
                                        className={`w-1 h-16 mt-2 rounded-full transition-colors duration-300 ${colors.line}`}
                                    />
                                )}
                            </div>

                            {/* Contenu */}
                            <div className={`flex-1 pb-6 ${step.isCurrent ? "bg-blue-50 border border-blue-200 rounded-lg p-4" : ""}`}>
                                <div className="flex items-center justify-between">
                                    <h3
                                        className={`font-bold text-lg ${
                                            step.isCompleted || step.isCurrent
                                                ? "text-gray-900"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {step.label}
                                    </h3>
                                    {step.isCompleted && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                            Terminé
                                        </span>
                                    )}
                                    {step.isCurrent && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                            En cours
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm mt-1 ${step.isCurrent ? "text-gray-700" : "text-gray-600"}`}>
                                    {step.description}
                                </p>
                                {step.completedAt && (
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <CheckCircle2 size={14} />
                                        {new Date(step.completedAt).toLocaleString("fr-FR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
