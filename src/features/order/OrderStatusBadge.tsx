import { OrderStatus } from "@/api/services/orders/types";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/types/order";

type Props = {
    status: OrderStatus;
};

export function OrderStatusBadge({ status }: Props) {
    const colors = ORDER_STATUS_COLORS[status];
    const label = ORDER_STATUS_LABELS[status];

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
        >
            {label}
        </span>
    );
}
