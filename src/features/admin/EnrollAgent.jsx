import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function EnrollAgent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // FIX: Initialize state once. Remove the useEffect below.
  const [step, setStep] = useState(() => searchParams.get('kycSuccess') === 'true' ? 3 : 1);
  
  const [formData, setFormData] = useState({ email: '', otp: '', password: '', name: '', kyc: {} });
  const [isVerified, setIsVerified] = useState(false);

  // REMOVED: The useEffect was causing the cascading render error.

  const sendOtp = async () => {
    try {
      await api.post('/api/auth/send-otp', { email: formData.email });
      alert("OTP sent!");
    } catch { alert("Failed to send OTP."); }
  };

  const verifyOtp = async () => {
    try {
      const res = await api.post('/api/auth/verify-otp', { email: formData.email, otp: formData.otp });
      if (res.data.verified) {
        setIsVerified(true);
        setStep(2);
      }
    } catch { alert("Invalid OTP"); }
  };

  const finalizeEnrollment = async () => {
    try {
      await api.post('/api/admin/enroll-agent', { 
        ...formData, 
        otpVerified: isVerified,
        secretKey: import.meta.env.VITE_GOVERNANCE_KEY 
      });
      alert("Enrollment Successful! Redirecting to login...");
      navigate('/admin-login');
    } catch (err) {
      alert(err.response?.data?.error || "Enrollment Failed");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto border shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Agent Enrollment - Step {step}</h2>
      
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <input className="border p-2" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <button className="bg-blue-600 text-white p-2" onClick={sendOtp}>Send OTP</button>
          <input className="border p-2" placeholder="Enter OTP" onChange={(e) => setFormData({...formData, otp: e.target.value})} />
          <button className="bg-green-600 text-white p-2" onClick={verifyOtp}>Verify</button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <p className="mb-4">Email Verified. Please complete KYC:</p>
          <button className="bg-orange-600 text-white p-3 rounded" onClick={() => window.location.href = '/api/auth/digilocker'}>
            Verify with DigiLocker
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <input className="border p-2" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input className="border p-2" type="password" placeholder="Set Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button className="bg-purple-700 text-white p-2" onClick={finalizeEnrollment}>Complete Enrollment</button>
        </div>
      )}
    </div>
  );
}