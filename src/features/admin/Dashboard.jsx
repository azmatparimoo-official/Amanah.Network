import { useState, useEffect } from 'react';
import api from '../../api';

export default function Dashboard() {
  // 1. STATE MANAGEMENT (Hooks must be at the top level)
  const [ledger, setLedger] = useState([]);
  const [analytics, setAnalytics] = useState({ totalDonated: 0, totalSpent: 0, balance: 0 });
  const [filter, setFilter] = useState({ from: '', to: '', actionType: 'ALL' });
  const [dates, setDates] = useState({ from: '', to: '' });
  
  // Local "Vault" state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputKey, setInputKey] = useState('');
  // 2. FETCH DATA LOGIC
  useEffect(() => {
    // Define the fetch logic directly inside the effect
    const fetchData = async () => {
      if (!isUnlocked) return;

      try {
        const config = {
      headers: {
        'x-governance-key': inputKey 
      }
    };
        const [analyticsRes, ledgerRes] = await Promise.all([
          api.get('/api/admin/analytics', config),
          api.get(`/api/admin/ledger`, { 
            ...config,
            params: { from: dates.from, to: dates.to, actionType: filter.actionType } 
          })
        ]);
        setAnalytics(analyticsRes.data);
        setLedger(ledgerRes.data);
      } catch (err) {
        console.error("Sync Error:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setIsUnlocked(false);
        }
      }
    };

    fetchData();
  }, [isUnlocked, dates.from, dates.to, filter.actionType , inputKey]); // Only re-run if these specific values change

  useEffect(() => 
    {
    const checkAccess = async () => {
    try {
      // Check backend to see if the session is still active
      await api.get('/api/admin/check-access'); 
      setIsUnlocked(true);
    } catch  {
      setIsUnlocked(false);
    }
  };
  checkAccess();
}, []);
  // 3. THE VAULT GATE
  const handleUnlock = async () => {
  try {
    const response = await api.post('/api/admin/verify-vault', { key: inputKey });
    if (response.data.unlocked) {
      setIsUnlocked(true);
    }
  } catch (err) {
    alert("Invalid Governance Key",err);
  }
};

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen font-mono">
        <h1 className="text-2xl mb-4 font-bold">DASHBOARD VAULT</h1>
        <input 
          type="password" 
          className="border-2 border-black p-2 mb-2 w-64" 
          onChange={(e) => setInputKey(e.target.value)} 
          placeholder="Enter Governance Key"
        />
        <button onClick={handleUnlock} className="bg-black text-white px-6 py-2 uppercase font-bold">Unlock Access</button>
      </div>
    );
  }
  return (
    <div className="p-8 max-w-6xl mx-auto font-mono bg-white min-h-screen">
      <header className="mb-10 border-b-2 border-black pb-6">
        <h1 className="text-4xl font-black uppercase text-[#284D3D]">Amanah Governance</h1>
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Secure Workstation | Authorized</p>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Received', val: analytics.totalDonated, color: 'bg-green-700' },
          { label: 'Total Spent', val: analytics.totalSpent || 0, color: 'bg-red-700' },
          { label: 'Current Reserve', val: analytics.balance, color: 'bg-blue-700' }
        ].map(kpi => (
          <div key={kpi.label} className={`${kpi.color} text-white p-6 shadow-lg`}>
            <h3 className="text-xs uppercase tracking-widest opacity-80">{kpi.label}</h3>
            <p className="text-3xl font-black mt-2">₹{kpi.val.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Filter Interface Only */}
      <div className="mb-10 border-2 border-black p-6">
          <h2 className="font-bold mb-4">FILTER LEDGER</h2>
          <div className="flex gap-2">
              <input type="date" className="border p-2" onChange={(e) => setDates({...dates, from: e.target.value})} />
              <input type="date" className="border p-2" onChange={(e) => setDates({...dates, to: e.target.value})} />
              <select className="border p-2" onChange={(e) => setFilter({...filter, actionType: e.target.value})}>
                <option value="ALL">All Actions</option>
                <option value="RECEIVED">Received</option>
                <option value="SPENT">Spent</option>
              </select>
          </div>
      </div>

      {/* Audit Ledger */}
      <section>
        <h2 className="text-xl font-bold mb-4 uppercase">System Audit Ledger</h2>
        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                {['Date', 'Action', 'Target', 'Amount', 'Txn ID'].map(h => (
                  <th key={h} className="p-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger && ledger.length > 0 ? (
                ledger.map((entry, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{new Date(entry.timestamp).toLocaleString('en-IN')}</td>
                    <td className={`p-3 font-bold ${entry.actionType === 'RECEIVED' ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.actionType}
                    </td>
                    <td className="p-3">{entry.target}</td>
                    <td className="p-3">₹{entry.amount.toLocaleString()}</td>
                    <td className="p-3 text-xs font-mono text-gray-500">{entry.transactionId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No ledger entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}