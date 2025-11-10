import axiosClient from "../http/axiosClient";

export const setupAuthInterceptor = (getToken: () => string | null) => {
    axiosClient.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.warn("Session expirée");
            }
            return Promise.reject(error);
        }
    );
};
