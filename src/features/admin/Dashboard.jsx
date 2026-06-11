import { useState, useEffect, useCallback } from 'react';
import api from '../../api';
export default function Dashboard({ currentUser }) {
  const [data, setData] = useState({
    users: [],
    transactions: [],
    disbursements: [],
    loading: true
  });
  
  const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '' });
  const [ledger, setLedger] = useState([]);
  // Use the API's analytics endpoint instead of manual calculation
  const [serverAnalytics, setServerAnalytics] = useState({ totalDonated: 0, totalDisbursed: 0, balance: 0 });

  const fetchDashboardData = useCallback(async () => {
    try {
      const [usersRes, txnsRes, disbRes, analyticsRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/donations'),
        api.get('/api/disbursements'),
        api.get('/api/admin/analytics')
      ]);
      
      setData({ 
        users: usersRes.data, 
        transactions: txnsRes.data, 
        disbursements: disbRes.data, 
        loading: false 
      });
      setServerAnalytics(analyticsRes.data);
      // setLedger(usersRes.data); // Kept as per your original code
    } catch (err) {
      console.error("Dashboard error:", err);
      setData(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    api.get('/api/admin/ledger', { 
      headers: { 'use-secret-key': localStorage.getItem('adminKey') } 
    })
    .then(res => setLedger(res.data))
    .catch(err => console.error("Ledger fetch error:", err));
  }, []);

  const handleApproveDisbursement = async (id) => {
    try {
      await api.patch(`/api/disbursements/approve/${id}`);
      // Audit log removed from here if not yet implemented, keeping just the core action
      await fetchDashboardData(); 
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/create-member', 
        formData, 
        { headers: { 'x-admin-id': currentUser._id } }
      );
      alert("Board member invited successfully!");
      setFormData({ email: '', firstName: '', lastName: '' });
    } catch (err) {
      console.error("Invite error:", err);
      alert("Failed to invite. Ensure you have admin privileges.");
    }
  };

  if (data.loading) return <div className="p-5">Syncing administrative workstations...</div>;

  const { users, transactions, disbursements } = data;

  return (
    <div className="p-8 font-sans">
      {/* KPI Section using Server-Side Data */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded text-center">
          <h3 className="text-sm">Total Received</h3>
          <p className="text-2xl font-bold">${serverAnalytics.totalDonated}</p>
        </div>
        <div className="bg-red-100 p-4 rounded text-center">
          <h3 className="text-sm">Total Disbursed</h3>
          <p className="text-2xl font-bold">${serverAnalytics.totalDisbursed}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded text-center">
          <h3 className="text-sm">Current Reserve</h3>
          <p className="text-2xl font-bold">${serverAnalytics.balance}</p>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Amanah Governance Workstation</h1>
      
      {/* Invite Section */}
      <div className="bg-white p-6 rounded shadow mb-6 border-l-4 border-blue-500">
        <h2 className="text-lg font-semibold mb-2">Invite New Board Member</h2>
        <form onSubmit={handleInvite} className="flex gap-2">
          <input className="border p-2 rounded" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} required />
          <input className="border p-2 rounded" placeholder="First Name" onChange={(e) => setFormData({...formData, firstName: e.target.value})} value={formData.firstName} required />
          <input className="border p-2 rounded" placeholder="Last Name" onChange={(e) => setFormData({...formData, lastName: e.target.value})} value={formData.lastName} required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Invite</button>
        </form>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">System Status: {users.length} users, {transactions.length} transactions.</div>
      
      {/* Disbursements List */}
      <div>
        {disbursements.map((d) => (
          <div key={d._id} className="border p-2 my-2 flex justify-between">
            <span>{d.projectTitle}</span>
            {d.status === 'PENDING' && (
              <button onClick={() => handleApproveDisbursement(d._id)} className="bg-blue-500 text-white px-3 py-1 rounded">Approve</button>
            )}
          </div>
        ))}
      </div>

      {/* Ledger Display */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">General Ledger</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date/Time</th>
              <th className="border p-2">Action</th>
              <th className="border p-2">Target</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry, idx) => (
              <tr key={idx} className="border-b">
                <td className="border p-2">{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'N/A'}</td>
                <td className="border p-2">{entry.actionType || 'N/A'}</td>
                <td className="border p-2">{entry.targetUserEmail || 'N/A'}</td>
                <td className="border p-2">${entry.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}