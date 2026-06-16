import { Navigate } from 'react-router-dom';

const AdminGuard = ({ children, isLoginRoute = false }) => {
    const hasGovAuth = sessionStorage.getItem('govAuth') === 'true';
    const hasUserAuth = sessionStorage.getItem('userAuth') === 'true';
    const GOV_PATH = import.meta.env.VITE_SECRET_TRANSFER_PATH;

    // 1. If no Governance key, they must go to the secret portal, period.
    if (!hasGovAuth) {
        return <Navigate to={GOV_PATH} replace />;
    }

    // 2. If we are at the Login Route, we have the Gov Key, so let them through.
    if (isLoginRoute) {
        return children; 
    }

    // 3. If we are here, we have Gov Key. Now check if they are logged in.
    if (!hasUserAuth) {
        return <Navigate to="/admin-login" replace />;
    }
    
    // 4. Both checks passed.
    return children;
};
export default AdminGuard;