interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_API_HOST: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
