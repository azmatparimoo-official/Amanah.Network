import { useState } from 'react';
import AuthPortal from './AuthPortal'; // Ensure this file exists

function AdminGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPortal, setShowPortal] = useState(false); // Added for portal toggle

  // Existing Secret Key access
  const secretKey = import.meta.env.VITE_ADMIN_KEY; 

  if (isAuthenticated) return children;

  // If "Login / Register" is clicked, show the portal
  if (showPortal) {
    return (
      <AuthPortal 
        onBack={() => setShowPortal(false)} 
        onAuthSuccess={(user) => {
          if (user.isVerified) setIsAuthenticated(true);
          else alert("Account pending Super Admin approval.");
        }} 
      />
    );
  }

  // Original UI remains exactly as you wrote it
  return (
    <div className="mb-10 border-b-2 border-black pb-8">
          <input 
            type="password" 
            placeholder="ENTER SECRET KEY" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border-2 border-black outline-none uppercase font-bold text-center mb-4 focus:border-[#C5A059]"
          />
          <button 
            onClick={() => {
              if (password === secretKey) setIsAuthenticated(true);
              else alert("Incorrect Key");
            }}
            className="w-full p-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-[#284D3D] transition-colors"
          >
            Unlock Workstation
          </button>
        </div>
  );
}
export default AdminGuard;