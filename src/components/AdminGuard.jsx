import { Navigate } from 'react-router-dom';

export const AdminGuard = ({ children }) => {
    const hasGovAuth = sessionStorage.getItem('govAuth') === 'true';
    const hasUserAuth = sessionStorage.getItem('userAuth') === 'true';
    const GOV_PATH = import.meta.env.VITE_SECRET_TRANSFER_PATH;

    if (!hasGovAuth) return <Navigate to={GOV_PATH} replace />;
    if (!hasUserAuth) return <Navigate to="/admin-login" replace />;
    
    return children;
};
export default AdminGuard;