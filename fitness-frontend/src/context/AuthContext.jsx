import { createContext, useContext, useEffect, useState } from "react";
import { saveToken, removeToken, getToken } from "../utils/token";

const AuthContext = createContext();

function loadStoredUser() {
    const saved = localStorage.getItem("fitness_user");
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch {
        localStorage.removeItem("fitness_user");
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadStoredUser);

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