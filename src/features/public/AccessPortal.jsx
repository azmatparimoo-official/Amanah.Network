import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccessPortal() {
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  const handleUnlock = () => {
    // 1. Validation check against your .env variable
    if (key === import.meta.env.VITE_GOVERNANCE_KEY) {
      
      // 2. Set the exact flag your AdminGuard looks for
      sessionStorage.setItem('govAuth', 'true');
      
      // 3. Clear the input so it doesn't linger in memory
      setKey(''); 
      
      // 4. Navigate to the login gate
      navigate('/admin-login'); 
    } else {
      alert("Invalid Governance Key");
      setKey(''); // Clear invalid key
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-10">
      <h2 className="text-xl font-bold mb-6 uppercase tracking-widest">Governance Access</h2>
      <input 
        type="password" 
        className="border-2 border-black p-3 mb-4 w-64 text-center"
        value={key}
        onChange={(e) => setKey(e.target.value)} 
        placeholder="Enter Governance Key"
      />
      <button 
        onClick={handleUnlock}
        className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition"
      >
        VERIFY & PROCEED
      </button>
    </div>
  );
}