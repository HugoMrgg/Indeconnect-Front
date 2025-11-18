import api from "../api";

export const setupAuthInterceptor = (getToken: () => string | null) => {
    api.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.warn("Session expirée");
            }
            return Promise.reject(error);
        }
    );
};
