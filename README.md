# Email Verification Assignment (MERN) - Updated

This project implements email verification using link or OTP.

## Quickstart (local, using docker-compose)

1. Copy `.env.example` files in `backend/` and `frontend/` to `.env` and edit as needed.
2. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in your shell or a .env file that docker-compose can read.
3. Run:
   ```
   docker-compose up --build
   ```
4. Frontend: http://localhost:5173
   Backend API: http://localhost:5000

## Endpoints
- POST /api/auth/signup  { name, email, password, method }  (method: 'link' or 'otp')
- GET  /api/auth/verify/:token
- POST /api/auth/verify-otp  { email, otp }
- POST /api/auth/resend  { email, method }

## Notes
- Rate limiting uses in-memory store (dev). For production, use Redis + rate-limiter-flexible.
- Tokens expire after 45 minutes by default and are single-use.
- Email sending uses SMTP if configured; otherwise logs to console.
