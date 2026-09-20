import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? (
        <Navigate to="/dashboard" replace />
    ) : (
        children
    );
}

export default PublicRoute;