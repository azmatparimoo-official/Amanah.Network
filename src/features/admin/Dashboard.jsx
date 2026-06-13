import { useState, useEffect, useCallback } from 'react';
import api from '../../api';

export default function Dashboard() {
  const [ledger, setLedger] = useState([]);
  const [analytics, setAnalytics] = useState({ totalDonated: 0, totalSpent: 0, balance: 0 });
  const [filter, setFilter] = useState({ from: '', to: '', actionType: 'ALL' });
  const [dates, setDates] = useState({ from: '', to: '' });

  const MASTER_KEY = import.meta.env.VITE_ADMIN_KEY;
  const getHeaders = useCallback(() => ({ 'use-secret-key': MASTER_KEY }), [MASTER_KEY]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [analyticsRes, ledgerRes] = await Promise.all([
        api.get('/api/admin/analytics', { headers: getHeaders() }),
        api.get(`/api/admin/ledger`, { 
          headers: getHeaders(), 
          params: { from: dates.from, to: dates.to, actionType: filter.actionType } 
        })
      ]);
      setAnalytics(analyticsRes.data);
      setLedger(ledgerRes.data);
    } catch (err) {
      console.error("Sync Error:", err);
    }
  }, [getHeaders, dates, filter]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchDashboardData();
    };
    fetchInitialData();
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