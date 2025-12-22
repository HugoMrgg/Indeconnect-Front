import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { BrandEthicsQuestionnaireModal } from "@/features/brands/BrandEthicsQuestionnaireModal";

import {SuperVendorEthicsStickyNotice} from "@/pages/brands/SuperVendorEthicsStickyNotice";
import {useAuth} from "@/hooks/Auth/useAuth";

export function SuperVendorEthicsGlobal() {
    const { user, isAuthenticated } = useAuth(); // <-- adapte si ton hook/context s'appelle autrement
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    const isSuperVendor = useMemo(() => {
        if (!isAuthenticated || !user) return false;

        // cas classiques : user.roles = ["SuperVendor"] ou user.role = "SuperVendor"
        const roles = (user as any).roles as string[] | undefined;
        const role = (user as any).role as string | undefined;

        if (roles?.some(r => r.toLowerCase() === "supervendor")) return true;
        if (role?.toLowerCase() === "supervendor") return true;

        return false;
    }, [isAuthenticated, user]);

    const isInSuperVendorArea = useMemo(() => {
        return (
            pathname.startsWith("/my-brand")
        );
    }, [pathname]);

    const enabled = isSuperVendor && isInSuperVendorArea;

    if (!enabled) return null;

    return (
        <>
            <SuperVendorEthicsStickyNotice
                onOpen={() => setOpen(true)}
                // si tu veux éviter qu’il cache un header local
                className="top-24"
            />

            <BrandEthicsQuestionnaireModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmitted={async () => {
                    window.dispatchEvent(new Event("ethics:updated"));
                }}
            />
        </>
    );
}
