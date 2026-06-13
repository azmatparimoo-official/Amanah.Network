// features/admin/AdminEntryPortal.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function AdminEntryPortal() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    try {
      await api.post('/api/auth/login', creds);
      navigate('/transferaid');
    } catch { alert("Invalid Credentials"); }
  };

  return (
    <div className="p-8">
      <h2>AGENT LOGIN</h2>
      <input placeholder="Email" onChange={(e) => setCreds({...creds, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setCreds({...creds, password: e.target.value})} />
      <button onClick={handleLogin}>LOGIN</button>
      <button onClick={() => navigate('/enrollment')}>Need to Register?</button>
    </div>
  );
}