// features/public/AccessPortal.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccessPortal() {
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  const handleUnlock = () => {
    if (key === import.meta.env.VITE_GOVERNANCE_KEY) {
      sessionStorage.setItem('governanceUnlocked', 'true');
      navigate('/admin-login'); // Redirect to the portal
    } else {
      alert("Invalid Governance Key");
    }
  };

  return (
    <div className="p-10 text-center">
      <input type="password" onChange={(e) => setKey(e.target.value)} />
      <button onClick={handleUnlock}>ENTER PORTAL</button>
    </div>
  );
}