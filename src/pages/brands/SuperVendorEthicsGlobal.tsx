import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { BrandEthicsQuestionnaireModal } from "@/features/brands/BrandEthicsQuestionnaireModal";

import {SuperVendorEthicsStickyNotice} from "@/pages/brands/SuperVendorEthicsStickyNotice";
import {useAuth} from "@/hooks/Auth/useAuth";

export function SuperVendorEthicsGlobal() {
    const { user, isAuthenticated } = useAuth(); // Adjust hook/context name if using different auth implementation
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    const isSuperVendor = useMemo(() => {
        if (!isAuthenticated || !user) return false;

        // Handle both roles array and single role property in user object
        const roles = (user as { roles?: string[] }).roles;
        const role = (user as { role?: string }).role;

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
                // Offset to prevent overlap with local header if present
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
