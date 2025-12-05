export interface BackendErrorResponse {
    status?: number;
    error?: string;
    message?: string;
    [key: string]: unknown;
}

export class ApiError extends Error {
    status: number;
    raw?: BackendErrorResponse | null;

    constructor(message: string, status: number, raw?: BackendErrorResponse | null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.raw = raw ?? null;
    }
}
