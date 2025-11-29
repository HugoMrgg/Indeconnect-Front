    export const INVITABLE_ROLES = ["Administrator", "Moderator", "SuperVendor"] as const;
export type InvitableRole = typeof INVITABLE_ROLES[number];

export interface InviteAccountRequest {
    email: string;
    firstName: string;
    lastName: string;
    targetRole: InvitableRole;
}

export interface InviteAccountFormData extends InviteAccountRequest {}
