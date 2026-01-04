import { Role } from "@/types/account";

/**
 * Définit quels rôles chaque role peut inviter
 */
export const INVITABLE_ROLES_BY_ROLE: Record<Role, Role[]> = {
    [Role.Administrator]: [Role.Moderator],
    [Role.Moderator]: [Role.SuperVendor],
    [Role.SuperVendor]: [Role.Vendor],
    [Role.Vendor]: [],
    [Role.Client]: []
};

/**
 * Retourne les rôles invitables pour un utilisateur
 */
export function getInvitableRoles(currentRole: Role): Role[] {
    return INVITABLE_ROLES_BY_ROLE[currentRole] ?? [];
}