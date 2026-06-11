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
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>🔐 Administration Gateway</h2>
      
      {/* 1. Secret Key Mode */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
        <input 
          type="password" 
          placeholder="Enter Secret Key" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button 
          onClick={() => {
            if (password === secretKey) setIsAuthenticated(true);
            else alert("Incorrect Key");
          }}
          style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}
        >
          Unlock
        </button>
      </div>

      {/* 2. Login/Register Link - Now toggles showPortal */}
      <div>
        <p>Are you a registered board member?</p>
        <button onClick={() => setShowPortal(true)}>
          Login / Register
        </button>
      </div>

      <br /><br />
      <a href="/">Return Home</a>
    </div>
  );
}

export default AdminGuard;