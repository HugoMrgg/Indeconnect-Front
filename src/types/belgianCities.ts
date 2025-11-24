/**
 * Liste des principales villes belges avec leurs coordonnées GPS
 * Utilisé pour simuler la position de l'utilisateur sans géolocalisation réelle
 */
export interface City {
    name: string;        // Nom de la ville
    latitude: number;    // Latitude GPS
    longitude: number;   // Longitude GPS
    province?: string;   // Province (optionnel)
}

export const belgianCities: City[] = [
    // Région de Bruxelles-Capitale
    { name: "Bruxelles", latitude: 50.8503, longitude: 4.3517, province: "Bruxelles-Capitale" },

    // Flandre
    { name: "Anvers", latitude: 51.2194, longitude: 4.4025, province: "Anvers" },
    { name: "Gand", latitude: 51.0543, longitude: 3.7174, province: "Flandre-Orientale" },
    { name: "Bruges", latitude: 51.2093, longitude: 3.2247, province: "Flandre-Occidentale" },
    { name: "Louvain", latitude: 50.8798, longitude: 4.7005, province: "Brabant flamand" },
    { name: "Malines", latitude: 51.0259, longitude: 4.4777, province: "Anvers" },
    { name: "Alost", latitude: 50.9481, longitude: 4.0397, province: "Flandre-Orientale" },
    { name: "Courtrai", latitude: 50.8279, longitude: 3.2646, province: "Flandre-Occidentale" },
    { name: "Hasselt", latitude: 50.9307, longitude: 5.3378, province: "Limbourg" },
    { name: "Saint-Nicolas", latitude: 51.1624, longitude: 4.1431, province: "Flandre-Orientale" },

    // Wallonie
    { name: "Liège", latitude: 50.6326, longitude: 5.5797, province: "Liège" },
    { name: "Charleroi", latitude: 50.4108, longitude: 4.4446, province: "Hainaut" },
    { name: "Namur", latitude: 50.4674, longitude: 4.8720, province: "Namur" },
    { name: "Mons", latitude: 50.4542, longitude: 3.9522, province: "Hainaut" },
    { name: "Tournai", latitude: 50.6059, longitude: 3.3889, province: "Hainaut" },
    { name: "Verviers", latitude: 50.5893, longitude: 5.8632, province: "Liège" },
    { name: "La Louvière", latitude: 50.4754, longitude: 4.1888, province: "Hainaut" },
    { name: "Mouscron", latitude: 50.7453, longitude: 3.2061, province: "Hainaut" },
    { name: "Arlon", latitude: 49.6836, longitude: 5.8167, province: "Luxembourg" },
    { name: "Wavre", latitude: 50.7167, longitude: 4.6111, province: "Brabant wallon" },
];
