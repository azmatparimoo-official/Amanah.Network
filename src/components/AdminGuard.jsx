import { Navigate } from 'react-router-dom';

const AdminGuard = ({ children, isLoginRoute = false }) => {
    const hasGovAuth = sessionStorage.getItem('govAuth') === 'true';
    const hasUserAuth = sessionStorage.getItem('userAuth') === 'true';

    const GOV_PATH = import.meta.env.VITE_SECRET_TRANSFER_PATH;
    // 1. If trying to go to login, but haven't entered Gov Key, bounce to Gov Page
    if (isLoginRoute) {
        if (!hasGovAuth) return <Navigate to={GOV_PATH} replace />;
        return children; // Let them see the login page
    }

    // 2. Standard guard for protected pages
    if (!hasGovAuth) return <Navigate to={GOV_PATH} replace />;
    if (!hasUserAuth) return <Navigate to="/admin-login" replace />;
    
    return children;
};

export default AdminGuard;