import {APIResponse} from "../types";

import type {
    Account,
    InputUserAdd,
    InputUserUpdate,
    InputUserUpdateAdmin,
    User,
    UserToken,
} from "./types";


import axios from "../api";
import { routes } from "./routes";

async function login(email: string, password: string) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return await axios.post<APIResponse<UserToken>>(routes.login, {
        email: email,
        password: password
    }, config);
}

async function checkToken(token: string) {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };

    return await axios.get<APIResponse<null>>(routes.checkToken, config);
}

export default {
    login,
    checkToken,
}