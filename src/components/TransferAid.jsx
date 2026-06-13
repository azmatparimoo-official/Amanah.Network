import { useState } from "react";
import api from '../api';
// TransferAid.jsx
export default function TransferAid() {
  const [transfer] = useState({ recipientName: '', amount: '', note: '' });
  
  const handleTransfer = async () => {
    // Call the secret URL here
    await api.post('/api/admin/transfer', transfer);
    alert("Funds sent!");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-black">AID DISBURSEMENT</h1>
      {/* Inputs for Name, Amount, Note */}
      <button onClick={handleTransfer} className="bg-red-700 text-white p-4">EXECUTE TRANSFER</button>
    </div>
  );
}