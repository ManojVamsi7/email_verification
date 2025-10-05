import axios from 'axios';
import { useState } from 'react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState('link');
  const [msg, setMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('Submitting...');
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/signup',
        { name, email, password, method }
      );
      setMsg(res.data.message || 'Check your email for verification.');
      if (method === 'otp') setOtpSent(true);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMsg('Verifying OTP...');
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/verify-otp',
        { email, otp }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div style={{ margin: '8px 0' }}>
          <label>
            <input
              type="radio"
              checked={method === 'link'}
              onChange={() => setMethod('link')}
            />{' '}
            Verify by Link
          </label>
          <label style={{ marginLeft: 12 }}>
            <input
              type="radio"
              checked={method === 'otp'}
              onChange={() => setMethod('otp')}
            />{' '}
            Verify by OTP
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 'Signup'}
        </button>
      </form>

      {/* OTP entry section if OTP mode is chosen */}
      {otpSent && method === 'otp' && (
        <div style={{ marginTop: '20px' }}>
          <h4>Enter OTP sent to your email</h4>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button onClick={verifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  );
}
