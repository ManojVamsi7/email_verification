import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function VerifyPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('Verifying your email...');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('No verification token provided.');
        setLoading(false);
        return;
      }

      try {
        // Make a request to backend to verify token
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`
        );

        // If backend sends JSON success message
        if (res.data?.message) {
          setStatus(res.data.message);
        } else {
          setStatus('Email verified successfully!');
        }

        // Optional: redirect to login page after 3 seconds
        setTimeout(() => navigate('/'), 3000);
      } catch (err) {
        // Backend may respond with HTML or error code
        console.error(err);
        if (err.response?.status === 400) {
          setStatus('Invalid or expired link. Please request a new verification email.');
        } else {
          setStatus('Verification failed. Try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="container">
      <h2>Email Verification</h2>
      {loading ? (
        <p>⏳ Verifying your account...</p>
      ) : (
        <>
          <p>{status}</p>
          {status.includes('expired') && (
            <p>
              You can go back to signup and use the <strong>resend verification</strong> option.
            </p>
          )}
          {status.includes('successfully') && (
            <p>
              Redirecting to login page... If not redirected,{' '}
              <a href="/">click here</a>.
            </p>
          )}
        </>
      )}
    </div>
  );
}
