export type User = {
    /** Identifiant unique de l'utilisateur */
    id: number,

    /** Prénom de l'utilisateur */
    first_name: string,

    /** Nom de l'utilisateur */
    last_name: string,

    /** Email de l'utilisateur */
    email: string,

    /** Mot de passe de l'utilisateur */
    password: string,

    /** Role d'utilisateur */
    role: string,
};

export type Account = {
    /** Prénom de l'utilisateur */
    first_name: string,

    /** Nom de l'utilisateur */
    last_name: string,

    /** Email de l'utilisateur */
    email: string,

    /** Mot de passe de l'utilisateur */
    password: string,

    /** Role d'utilisateur */
    role: string,
};

export type InputUserAdd = {
    /** Prénom de l'utilisateur */
    first_name: string,

    /** Nom de l'utilisateur */
    last_name: string,

    /** Email de l'utilisateur */
    email: string,

    /** Mot de passe de l'utilisateur */
    password: string,
};

export type InputUserUpdate = {
    /** Identifiant unique de l'utilisateur */
    id: number,

    /** Prénom de l'utilisateur */
    first_name: string,

    /** Nom de l'utilisateur */
    last_name: string,

    /** Email de l'utilisateur */
    email: string,

    /** Mot de passe de l'utilisateur */
    password: string,
};

export type InputUserUpdateAdmin = {
    /** Identifiant unique de l'utilisateur */
    id: number,

    /** Prénom de l'utilisateur */
    first_name: string,

    /** Nom de l'utilisateur */
    last_name: string,

    /** Email de l'utilisateur */
    email: string,
};

export type UserToken = {
    /** Jeton d'authentification */
    token: string,

    /** Email de l'utilisateur */
    email: string,
};