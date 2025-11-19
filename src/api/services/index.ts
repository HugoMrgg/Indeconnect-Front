// fichier contenant l'export de tous les services
import UserService from "./user"
import { AuthService } from "./auth"

export const API = {
    //user
    users: UserService,

    //auth
    auth: AuthService,
}