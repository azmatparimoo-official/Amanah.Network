import { useState } from 'react';
import api from '../../api';

export default function SecureTransfer() {
  const [transfer, setTransfer] = useState({ recipientName: '', amount: '', note: '' });

  const handleSecureTransfer = async () => {
    // Call the secret URL from your .env
    const secretPath = import.meta.env.VITE_SECRET_TRANSFER_PATH;
    try {
      await api.post(secretPath, transfer);
      alert("Transfer Successful");
    } catch {
      alert("Unauthorized or Failed");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6">SECURE DISBURSEMENT PORTAL</h1>
      <input placeholder="Name" className="border p-2 block w-full mb-2" onChange={(e) => setTransfer({...transfer, recipientName: e.target.value})} />
      <input type="number" placeholder="Amount" className="border p-2 block w-full mb-2" onChange={(e) => setTransfer({...transfer, amount: e.target.value})} />
      <button onClick={handleSecureTransfer} className="bg-red-700 text-white p-4">EXECUTE TRANSFER</button>
    </div>
  );
}