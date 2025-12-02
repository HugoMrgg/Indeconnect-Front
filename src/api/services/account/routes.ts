export const routes = {
    list: "/users/accounts",
    toggleStatus: (accountId: number) => `/users/${accountId}/toggle`,
    resendInvitation: "/auth/invite",
};
