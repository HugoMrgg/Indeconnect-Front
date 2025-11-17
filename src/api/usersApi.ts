import { User } from "@/types/users"

export interface UsersResponse {
    users: User[];
}

const MOCK_USERS: User[] = [
    {
        id: 1,
        first_name: "Saucisse",
        last_name: "biengrille",
        email: "saucisse@gmail.com",
        password: "saucisse",
        role: "user",
    },
    {
        id: 2,
        first_name: "Admin",
        last_name: "System",
        email: "admin@mail.com",
        password: "admin123",
        role: "admin",
    },
];

export async function fetchUsers(): Promise<UsersResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ users: MOCK_USERS });
        }, 600);
    });
}

export async function login(email: string, password: string): Promise<User | null> {
    const { users } = await fetchUsers();

    const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    return found ?? null;
}

export async function register(payload: {email: string;
                                        password: string;
                                        first_name: string;
                                        last_name: string;
                                    }): Promise<User> {
    await new Promise((res) => setTimeout(res, 600)); // délai mock

    // prevent duplicate account
    const exists = MOCK_USERS.some(
        (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (exists) throw new Error("Cet email est déjà utilisé.");

    const newUser: User = {
        id: Date.now(),
        role: "user",
        ...payload,
    };

    MOCK_USERS.push(newUser);
    return newUser;
}
