import { useState } from 'react';
import api from '../api';

export default function TransferAid() {
  const [formData, setFormData] = useState({
    orgName: '',
    address: '',
    ciaNumber: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    accountNumber: '',
    ifscCode: '',
    email: ''
  });

  const handleTransfer = async () => {
    try {
      // The backend should handle email logic and DB saving
      await api.post('/api/admin/transfer', formData);
      alert("Funds sent and confirmation email triggered!");
    } catch {
      alert("Transfer failed. Please check the credentials.");
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto font-mono">
      <h1 className="text-2xl font-black mb-6">AID DISBURSEMENT PORTAL</h1>
      
      <div className="grid grid-cols-1 gap-4">
        <input placeholder="Receiving Org Name" onChange={(e) => setFormData({...formData, orgName: e.target.value})} className="border-2 p-2" />
        <textarea placeholder="Complete Address" onChange={(e) => setFormData({...formData, address: e.target.value})} className="border-2 p-2" />
        <input placeholder="CIA Number" onChange={(e) => setFormData({...formData, ciaNumber: e.target.value})} className="border-2 p-2" />
<input 
  type="number" 
  min="0" 
  placeholder="Amount" 
  value={formData.amount} // Controlled component
  onChange={(e) => {
    const val = Math.max(0, parseFloat(e.target.value) || 0);
    setFormData({...formData, amount: val});
  }} 
  className="border-2 p-2" 
/>        <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="border-2 p-2" />
        <input placeholder="Account Number (Razorpay Verified)" onChange={(e) => setFormData({...formData, account: e.target.value})} className="border-2 p-2" />
        <input placeholder="IFSC Code" onChange={(e) => setFormData({...formData, ifsc: e.target.value})} className="border-2 p-2" />
        <input type="email" placeholder="Receiving Org Email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="border-2 p-2" />
        
        <button 
          onClick={handleTransfer} 
          className="bg-black text-white p-4 font-bold hover:bg-green-800 transition"
        >
          EXECUTE SECURE TRANSFER
        </button>
      </div>
    </div>
  );
}