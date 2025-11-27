import * as routes from "./routes";

export const BrandSubscriptionService = {
    subscribe: routes.subscribe,
    unsubscribe: routes.unsubscribe,
    getUserSubscriptions: routes.getUserSubscriptions,
    isSubscribed: routes.isSubscribed,
};

export * from "./types";
