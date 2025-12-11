export type User = {
    /** Identifiant unique de l'utilisateur */
    id: number,

    /** Prénom de l'utilisateur */
    firstName: string,

    /** Nom de l'utilisateur */
    lastName: string,

    /** Email de l'utilisateur */
    email: string,

    /** Mot de passe de l'utilisateur */
    password?: string,

    /** Role d'utilisateur */
    role: string,
};