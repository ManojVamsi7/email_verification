# Backend - Email Verification Assignment (Updated)

## Features
- Signup with link or OTP verification
- Tokens stored in MongoDB and single-use
- Resend endpoint with rate-limiting (in-memory for dev)
- Email sending via SMTP or console mock

## Setup
1. Copy .env.example to .env and update values.
2. Install:
   ```
   cd backend
   npm install
   npm run dev
   ```
3. For Docker Compose:
   ```
   docker-compose up --build
   ```
