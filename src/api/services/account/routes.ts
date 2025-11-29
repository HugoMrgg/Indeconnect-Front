// @/api/services/accounts/routes.ts

export const routes = {
    list: "/users/accounts",
    toggleStatus: (accountId: number) => `/admin/accounts/${accountId}/toggle`,
};
