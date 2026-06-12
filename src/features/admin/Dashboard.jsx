import { useState, useCallback } from 'react';
import api from '../../api';

export default function Dashboard() {
  const [data, setData] = useState({ transactions: [], disbursements: [], loading: true });
  const [ledger, setLedger] = useState([]);
  const [analytics, setAnalytics] = useState({ totalDonated: 0, totalDisbursed: 0, balance: 0 });
  
  // State for Master Key
  const [inputKey, setInputKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const MASTER_KEY = import.meta.env.VITE_ADMIN_KEY;

  const getHeaders = useCallback(() => ({ 'use-secret-key': MASTER_KEY }), [MASTER_KEY]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [txnsRes, disbRes, analyticsRes, ledgerRes] = await Promise.all([
        api.get('/api/donations', { headers: getHeaders() }),
        api.get('/api/disbursements', { headers: getHeaders() }),
        api.get('/api/admin/analytics', { headers: getHeaders() }),
        api.get('/api/admin/ledger', { headers: getHeaders() })
      ]);

      setData({ 
        transactions: txnsRes.data, 
        disbursements: disbRes.data, 
        loading: false 
      });
      setAnalytics(analyticsRes.data);
      setLedger(ledgerRes.data);
    } catch (err) {
      console.error("Governance Sync Error:", err);
      setData(prev => ({ ...prev, loading: false }));
    }
  }, [getHeaders]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (inputKey === MASTER_KEY) {
      setIsUnlocked(true);
      await fetchDashboardData();
    } else {
      alert("Invalid Master Key");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-black mb-6 uppercase tracking-widest text-[#284D3D]">Governance Access</h1>
        <form onSubmit={handleUnlock}>
          <input 
            type="password"
            className="border-2 border-black p-4 w-64 outline-none text-center"
            placeholder="ENTER MASTER KEY" 
            onChange={(e) => setInputKey(e.target.value)} 
            value={inputKey} 
          />
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-mono bg-white min-h-screen">
      <header className="mb-10 border-b-2 border-black pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase text-[#284D3D]">Amanah Governance</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Secure Workstation v1.0</p>
        </div>
        <button onClick={() => setIsUnlocked(false)} className="text-xs underline">Lock Workstation</button>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Received', val: analytics.totalDonated, color: 'bg-green-700' },
          { label: 'Total Disbursed', val: analytics.totalDisbursed, color: 'bg-red-700' },
          { label: 'Current Reserve', val: analytics.balance, color: 'bg-blue-700' }
        ].map(kpi => (
          <div key={kpi.label} className={`${kpi.color} text-white p-6 shadow-lg`}>
            <h3 className="text-xs uppercase tracking-widest opacity-80">{kpi.label}</h3>
            <p className="text-3xl font-black mt-2">₹{kpi.val.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Disbursements */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 uppercase">Pending Disbursements</h2>
        <div className="bg-white border-2 border-black p-4">
          {data.disbursements.filter(d => d.status === 'PENDING').map(d => (
            <div key={d._id} className="flex justify-between items-center py-3 border-b last:border-0">
              <span className="font-bold">{d.projectTitle} - ₹{d.amount}</span>
              <button 
                onClick={async () => {
                  await api.patch(`/api/disbursements/approve/${d._id}`, {}, { headers: getHeaders() });
                  fetchDashboardData();
                }} 
                className="bg-black text-white px-4 py-2 text-xs uppercase hover:bg-[#284D3D]"
              >Authorize</button>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Ledger */}
      <section>
        <h2 className="text-xl font-bold mb-4 uppercase">System Audit Ledger</h2>
        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>{['Date', 'Action', 'Target', 'Amount'].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {ledger.map((entry, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(entry.timestamp).toLocaleDateString('en-IN')}</td>
                  <td className="p-3">{entry.actionType}</td>
                  <td className="p-3">{entry.targetUserEmail}</td>
                  <td className="p-3 font-bold">₹{entry.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}