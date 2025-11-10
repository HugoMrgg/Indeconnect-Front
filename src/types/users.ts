export interface User {
    /** Identifiant unique de l'utilisateur */
    id: number;

    /** Prénom de l'utilisateur */
    first_name: string;

    /** Nom de l'utilisateur */
    last_name: string;

    /** Email de l'utilisateur */
    email: string;

    /** Mot de passe de l'utilisateur */
    password: string;

    /** Role d'utilisateur */
    role: string;
}