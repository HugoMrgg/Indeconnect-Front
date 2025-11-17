export interface Product {
    /** Identifiant unique du produit */
    id: number;

    /** Nom du produit (ex: "T-shirt Lucid") */
    name: string;

    /** Prix TTC du produit */
    price: number;

    /** Nom de la marque associée (ex: "6K Skateshop") */
    brand: string;

    /** Catégorie du produit (ex: "t-shirt", "pull", etc.) */
    category?: string;

    /** URL de l’image produit */
    image?: string;

    /** Liste des tailles disponibles (ex: ["S", "M", "L"]) */
    sizes?: string[];

    /** Tags marketing (ex: ["nouveau", "promo", "eco"]) */
    tags?: string[];

    /** Date de création ou ajout dans le catalogue */
    createdAt?: string;

    /** Indique si le produit est en promotion */
    onSale?: boolean;

    /** Couleur principale du produit en hexadécimal (ex: "#FF5733") */
    color?: string;

    /** Labels éthiques associés au produit (ex: ["bio", "commerce équitable"]) */
    ethics?: string[];
}
