import axios from "axios";
import { getToken, removeToken } from "../utils/token";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach JWT to every request
api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Handle 401 / session expiry globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            removeToken();
            localStorage.removeItem("fitness_user");
            localStorage.removeItem("activities_cache");
            localStorage.removeItem("recommendation_cache");

            if (
                window.location.pathname !== "/login" &&
                window.location.pathname !== "/register"
            ) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;