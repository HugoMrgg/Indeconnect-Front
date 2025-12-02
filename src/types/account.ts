// @/types/account.ts
export enum Role {
    Administrator = "Administrator",
    Moderator = "Moderator",
    SuperVendor = "SuperVendor",
    Vendor = "Vendor",
    Client = "Client"
}

export type InvitableRole = "Administrator" | "Moderator" | "SuperVendor" | "Vendor";

export interface InviteAccountRequest {
    email: string;
    firstName: string;
    lastName: string;
    targetRole: InvitableRole;
}