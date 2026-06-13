// components/AdminGuard.jsx
import { Navigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
  // We check if the key was verified by the backend
  const hasAccess = sessionStorage.getItem('governanceUnlocked') === 'true';

  if (!hasAccess) {
    // If not, force them to the home page immediately
    return <Navigate to="/" replace />;
  }

  return children;
}