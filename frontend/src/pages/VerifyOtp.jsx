import axios from 'axios';
import { useState } from 'react';

export default function VerifyOtp() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('Verifying...');
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/verify-otp',
        { email, otp }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const resend = async (m = 'otp') => {
    setLoading(true);
    setMsg('Resending...');
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/resend',
        { email, method: m }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error resending');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Email Verification (OTP)</h2>
      <form onSubmit={submit} style={{ marginBottom: 12 }}>
        <input
          placeholder="Enter your registered email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 'Verify OTP'}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => resend('otp')} disabled={loading}>
          Resend OTP
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => resend('link')}
          disabled={loading}
        >
          Send Verification Link Instead
        </button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
