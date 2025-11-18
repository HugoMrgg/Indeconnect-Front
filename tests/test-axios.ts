// test-axios.ts
import axios, { AxiosError } from 'axios';

// L'URL et le payload exacts de votre configuration Axios
const TEST_URL: string = "http://localhost:5237/indeconnect/auth/login";
const PAYLOAD = {
    email: "ok@gmail.com",
    password: "4cpZ:5G8zQv&Te*"
};

async function testConnection(): Promise<void> {
    console.log(`\n======================================================`);
    console.log(`🚀 Tentative de connexion au backend via TS/Axios: ${TEST_URL}`);
    console.log(`Payload utilisé:`, PAYLOAD.email);
    console.log(`======================================================`);

    try {
        const response = await axios.post(TEST_URL, PAYLOAD, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000 // Utiliser le même timeout de 10 secondes
        });

        console.log("✅ Connexion réussie via Axios (hors React)!");
        console.log(`Code Statut: ${response.status} (${response.statusText})`);

        // Affiche une partie de la réponse pour confirmer le succès
        if (response.data && typeof response.data === 'object') {
            const token = response.data.token ? 'Token reçu' : 'Pas de token';
            console.log(`Données reçues: { user: ..., ${token} }`);
        } else {
            console.log("Données reçues (texte brut):", response.data);
        }

    } catch (error) {
        // Gérer spécifiquement les erreurs Axios
        const axiosError = error as AxiosError;

        if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
            console.error("❌ ÉCHEC SÉVÈRE (ERR_NETWORK / TIMEOUT)");
            console.error("   Le serveur est INACCESSIBLE. Raisons probables:");
            console.error("   1. Le serveur C# n'est pas démarré.");
            console.error("   2. Le port (5237) est incorrect ou bloqué par un pare-feu.");
            console.error("   3. Le temps d'attente (10s) a été dépassé.");
            console.error(`   Message d'erreur: ${axiosError.message}`);
        } else if (axiosError.response) {
            // Reçu une réponse mais avec un statut d'erreur (4xx, 5xx)
            console.error(`⚠️ Réponse du serveur avec ERREUR HTTP: ${axiosError.response.status}`);
            console.error("   Ce n'est PAS un Network Error. Le backend a répondu.");
            console.error(`   Message du serveur: ${JSON.stringify(axiosError.response.data)}`);
            console.error("   => Le problème est la logique (login invalide, etc.), PAS la connectivité.");
        } else {
            console.error("Erreur Inconnue:", axiosError.message);
        }
    }
    console.log(`======================================================\n`);
}

testConnection();