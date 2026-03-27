import { useAuth } from "../context/AuthContex.jsx";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { session } = useAuth();

    if (session === undefined) {
        return <div>Loading...</div>
    }

    return session ? <>{children}</> : <Navigate to="/" />
}

export default ProtectedRoute;