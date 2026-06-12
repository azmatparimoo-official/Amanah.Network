import { useState, useEffect, useCallback } from 'react';
import api from '../../api';

export default function Dashboard() {
  //const [data, setData] = useState({ transactions: [], disbursements: [], loading: true });
  const [ledger, setLedger] = useState([]);
  const [analytics, setAnalytics] = useState({ totalDonated: 0, totalDisbursed: 0, balance: 0 });

  // Get key directly from environment for headers
  const MASTER_KEY = import.meta.env.VITE_ADMIN_KEY;
  const getHeaders = useCallback(() => ({ 'use-secret-key': MASTER_KEY }), [MASTER_KEY]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [ analyticsRes, ledgerRes] = await Promise.all([
        api.get('/api/donations', { headers: getHeaders() }),
        api.get('/api/disbursements', { headers: getHeaders() }),
        api.get('/api/admin/analytics', { headers: getHeaders() }),
        api.get('/api/admin/ledger', { headers: getHeaders() })
      ]);

      // setData({ 
      //   transactions: txnsRes.data, 
      //   disbursements: disbRes.data, 
      //   loading: false 
      // });
      setAnalytics(analyticsRes.data);
      setLedger(ledgerRes.data);
    } catch (err) {
      console.error("Governance Sync Error:", err);
      // setData(prev => ({ ...prev, loading: false }));
    }
  }, [getHeaders]);

  useEffect(() => {
    const loadDashboardData = async () => {
      await fetchDashboardData();
    };

    loadDashboardData();
  }, [fetchDashboardData]);

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
         // { label: 'Total Disbursed', val: analytics.totalDisbursed, color: 'bg-red-700' },
          { label: 'Current Reserve', val: analytics.balance, color: 'bg-blue-700' }
        ].map(kpi => (
          <div key={kpi.label} className={`${kpi.color} text-white p-6 shadow-lg`}>
            <h3 className="text-xs uppercase tracking-widest opacity-80">{kpi.label}</h3>
            <p className="text-3xl font-black mt-2">₹{kpi.val.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Disbursements */}
      

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
    {ledger.map((entry, i) => (
      <tr key={i} className="border-b hover:bg-gray-50">
        <td className="p-3">{new Date(entry.timestamp).toLocaleString('en-IN')}</td>
        <td className={`p-3 font-bold ${entry.actionType === 'RECEIVED' ? 'text-green-600' : 'text-red-600'}`}>
          {entry.actionType}
        </td>
        <td className="p-3">{entry.target}</td>
        <td className="p-3">₹{entry.amount.toLocaleString()}</td>
        <td className="p-3 text-xs font-mono text-gray-500">{entry.transactionId}</td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
      </section>
    </div>
  );
}