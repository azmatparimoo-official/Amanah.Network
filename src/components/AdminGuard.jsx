import { Navigate } from 'react-router-dom';

const AdminGuard = ({ children }) => {
    const hasGovAuth = sessionStorage.getItem('govAuth') === 'true';
    const hasUserAuth = sessionStorage.getItem('userAuth') === 'true';

    // 1. If no Governance Key, force them back to the start
    if (!hasGovAuth) {
        return <Navigate to="/Home" replace />;
    }

    // 2. If they have the Key but haven't logged in, send them to Login
    if (!hasUserAuth) {
        return <Navigate to="/admin-login" replace />;
    }

    // 3. If both flags are true, allow access to TransferAid
    return children;
};

export default AdminGuard;