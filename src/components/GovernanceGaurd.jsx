import { Navigate } from 'react-router-dom';

export const GovernanceGuard = ({ children }) => {
    const hasGovAuth = sessionStorage.getItem('govAuth') === 'true';
    const GOV_PATH = import.meta.env.VITE_SECRET_TRANSFER_PATH;

    if (!hasGovAuth) return <Navigate to={GOV_PATH} replace />;
    return children;
};