import { useTranslation } from "react-i18next";
import { OrderStatus } from "@/api/services/orders/types";
import { ORDER_STATUS_I18N_KEYS, ORDER_STATUS_COLORS } from "@/types/order";

type Props = {
    status: OrderStatus;
};

export function OrderStatusBadge({ status }: Props) {
    const { t } = useTranslation();
    const colors = ORDER_STATUS_COLORS[status];
    const labelKey = ORDER_STATUS_I18N_KEYS[status];

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
        >
            {t(labelKey)}
        </span>
    );
}
