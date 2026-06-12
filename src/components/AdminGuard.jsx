import { useState } from 'react';
import AuthPortal from './AuthPortal';

function AdminGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPortal, setShowPortal] = useState(false);

  const secretKey = import.meta.env.VITE_ADMIN_KEY; 

  if (isAuthenticated) return children;

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

  return (
    // Centering the entire screen content
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-mono p-4">
      
      {/* Constraining the box width to 400px (max-w-sm) */}
      <div className="w-full max-w-sm border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-black uppercase text-[#284D3D] mb-6 text-center">Governance Access</h2>
        
        <div className="mb-6">
          <input 
            type="password" 
            placeholder="ENTER SECRET KEY" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-black outline-none uppercase font-bold text-center mb-4 focus:border-[#C5A059]"
          />
          <button 
            onClick={() => {
              if (password === secretKey) setIsAuthenticated(true);
              else alert("Incorrect Key");
            }}
            className="w-full p-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-[#284D3D] transition-colors"
          >
            Unlock Workstation
          </button>
        </div>

        <div className="text-center border-t border-black pt-4">
          <button 
            onClick={() => setShowPortal(true)}
            className="text-xs font-bold uppercase underline hover:text-[#C5A059]"
          >
            Board Member Portal
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminGuard;