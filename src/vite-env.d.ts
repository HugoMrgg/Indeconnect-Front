interface ImportMetaEnv {
    // Variables d'environnement Vite standard
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;

    // Variables d'environnement custom
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_API_HOST: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
    readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
