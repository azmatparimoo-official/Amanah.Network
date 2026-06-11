import { useState } from 'react';
import api from '../../api';

export default function Donate() {
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [donorName, setDonorName] = useState('');
  const handlePayment = async (amount) => {
    const { data: order } = await api.post('/api/payment/create-order',
       { 
        amount: amount,
        donorEmail: donorEmail,
        donorName: donorName,
        projectTitle: "General Donation"
       });

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", 
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      handler: async (response) => {
        const verifyRes = await api.post('/api/payment/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        if (verifyRes.data.status === 'success') alert("Payment Successful!");
      },
      prefill: { name: "Donor", email: donorEmail }
    };
  console.log("Payment options:", options); // Debug log to check options before opening Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    
    // Logic to prevent negative or zero values
    if (Number(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid donation amount.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await handlePayment(Number(amount));
      setMessage({ type: 'success', text: 'Thank you for your donation!' });
      setDonorEmail('');
      setAmount('');
    } catch (err) {
      console.error(err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || "Payment network error. Try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-24 px-6 md:px-12 lg:px-24">
      <header className="mb-12 text-left">
       <div className="mb-6">
        <span className="text-[#284D3D] font-mono tracking-[0.2em] uppercase text-xs">Secure</span>
        <span className="text-[#C5A059] font-mono tracking-[0.2em] uppercase text-xs ml-2">Portal</span>
       </div>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
          <span className="text-[#284D3D]">Unified</span> 
          <span className="text-[#C5A059] ml-3">Transaction Engine.</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-xl">Your contribution directly drives the high-transparency foundation network.</p>
      </header>

      {message.text && (
        <div className={`p-4 mb-8 font-bold uppercase tracking-widest text-xs border max-w-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <form onSubmit={handleDonation} className="space-y-8 max-w-xl">
        <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-2">Full Name</label>
        <input 
        type="text" 
        value={donorName} 
       onChange={(e) => setDonorName(e.target.value)} 
       required 
       className="w-full p-4 border-2 border-black focus:border-[#C5A059] outline-none"/>
      </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">Confirm Your Registered Email Address</label>
          <input 
            type="email" 
            value={donorEmail} 
            onChange={(e) => setDonorEmail(e.target.value)} 
            required 
            className="w-full p-4 border-2 border-black focus:border-[#C5A059] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">Donation Amount (INR)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            min="1" 
            required 
            className="w-full p-4 border-2 border-black focus:border-[#C5A059] outline-none transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full p-4 bg-[#284D3D] text-white font-bold uppercase tracking-widest border-2 border-black hover:bg-black transition-all duration-300 disabled:bg-gray-400"
        >
          {isLoading ? 'Processing securely...' : 'Authorize Donation'}
        </button>
      </form>
    </div>
  );
}