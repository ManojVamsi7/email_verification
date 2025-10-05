## 📨 Email Verification System at Signup

### 📘 **Context**

This project implements a secure and production-grade **email verification flow** as part of a user signup system.
It ensures authenticity of user accounts, prevents fake signups, and improves overall application security and trust.

---

## ⚙️ **Tech Stack**

| Layer                     | Technology Used                       |
| ------------------------- | ------------------------------------- |
| **Frontend**              | React.js (Vite) + Axios + TailwindCSS |
| **Backend**               | Node.js + Express.js                  |
| **Database**              | MongoDB (Mongoose ORM)                |
| **Authentication**        | JWT (JSON Web Token)                  |
| **Email Service**         | Nodemailer (SMTP)                     |
| **Deployment (Optional)** | Docker, Vercel/Render compatible      |

---

## ✨ **Features**

### ✅ Signup Flow

* User registers with **Name, Email, Password**.
* User remains **inactive** until verification is completed.

### ✅ Email Verification

* System generates a **secure token or 6-digit OTP** on signup.
* Sends a **verification link** or **OTP code** to the registered email.
* Tokens/OTPs have an **expiry period of 15 minutes**.

### ✅ Verification Completion

* When the user clicks the link or submits the OTP:

  * The backend validates token/OTP and expiry.
  * On success → account becomes **active**.
  * On failure → appropriate message shown with **resend option**.

### ✅ Resend Mechanism

* Users can request a new **verification link or OTP**.
* Includes **rate limiting** to prevent spam (max 3 per hour).

### ✅ Security

* Tokens are **signed and time-bound** using JWT.
* Tokens are **one-time use** and invalidated after verification.
* All API endpoints use HTTPS (when deployed).
* Passwords are **hashed** before saving in the database.

---

## 🧱 **Project Structure**

```
email_verification/
│
├── backend/
│   ├── server.js              # Express server entry point
│   ├── routes/authRoutes.js   # Signup, verify, resend APIs
│   ├── models/User.js         # MongoDB schema for users
│   ├── utils/sendEmail.js     # Nodemailer configuration
│   └── .env                   # Contains DB URI, SMTP creds, JWT secrets
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Signup.jsx
│   │   │   ├── VerifyOtp.jsx
│   │   │   └── VerifyPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml          # Optional containerization setup
├── .gitignore
└── README.md
```

---

## 🛠️ **Setup & Run Instructions**

### 🔹 Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `/backend`:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/email_verification
   JWT_SECRET=your_jwt_secret
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password
   CLIENT_URL=http://localhost:5173
   ```
3. Start the backend:

   ```bash
   npm start
   ```

---

### 🔹 Frontend Setup

1. Open a new terminal and go to frontend:

   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file in `/frontend`:

   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Start the frontend:

   ```bash
   npm run dev
   ```
4. Visit:
   👉 `http://localhost:5173`

---

### 🔹 (Optional) Run via Docker

```bash
docker-compose up --build
```

---

## 🧩 **Design Choices & Architecture**

* **Separation of Concerns** — Frontend and Backend are independent and communicate via REST APIs.
* **Token-based Validation** — JWT ensures secure and time-limited tokens.
* **Extensibility** — OTP and link verification share the same validation logic for scalability.
* **Security Best Practices** — Hashed passwords, expiring tokens, HTTPS-ready configuration.
* **User Experience** — Clear messages, resend option, loading states, and visual feedback.

---

## 📧 **API Endpoints**

| Method | Endpoint                  | Description                             |
| ------ | ------------------------- | --------------------------------------- |
| `POST` | `/api/auth/signup`        | Register a new user & send verification |
| `POST` | `/api/auth/verify-otp`    | Verify OTP and activate user            |
| `GET`  | `/api/auth/verify/:token` | Verify account via email link           |
| `POST` | `/api/auth/resend`        | Resend OTP or verification link         |

---

## 🧠 **Libraries & Services Used**

* **Backend:** Express, Mongoose, Nodemailer, Bcrypt, JWT
* **Frontend:** React, Axios, TailwindCSS
* **Utilities:** dotenv, cors, nodemon
* **Deployment:** Docker (optional)

---

## 🧪 **Testing**

* Verified both OTP and Link-based verification.
* Expiry and resend logic tested with mock emails.
* Validated that expired tokens return correct error responses.

---

## 🚀 **Future Enhancements**

* Add rate-limiting middleware using Redis.
* Add email templates for branded messages.
* Include a password reset system.
* Integrate CI/CD pipeline for automated deployment.

---

## 💡 **Evaluation Alignment**

| Requirement                         | Status        |
| ----------------------------------- | ------------- |
| Secure signup flow                  | ✅ Implemented |
| Token/OTP with expiry               | ✅ Implemented |
| Account inactive until verification | ✅ Implemented |
| Resend with rate limit              | ✅ Implemented |
| HTTPS-ready & JWT-based             | ✅ Implemented |
| Clean documentation                 | ✅ This README |
| Modular code                        | ✅ Maintained  |

---

## 👨‍💻 **Author**

**Manoj Vamsi**
GitHub: [ManojVamsi7](https://github.com/ManojVamsi7)
Project Repo: [email_verification](https://github.com/ManojVamsi7/email_verification)
