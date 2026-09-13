import { createContext, useContext, useEffect, useState } from "react";
import { saveToken, removeToken, getToken } from "../utils/token";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("fitness_user");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("fitness_user", JSON.stringify(user));
        }
    }, [user]);

    const login = (userData, token) => {
        saveToken(token);
        setUser(userData);
    };

    const logout = () => {
        removeToken();
        localStorage.removeItem("fitness_user");
        localStorage.removeItem("activities_cache");
        localStorage.removeItem("recommendation_cache");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token: getToken(),
                login,
                logout,
                isAuthenticated: !!getToken(),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);