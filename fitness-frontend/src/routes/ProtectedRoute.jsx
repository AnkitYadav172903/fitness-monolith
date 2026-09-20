import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/token";

function ProtectedRoute({ children }) {
    return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;