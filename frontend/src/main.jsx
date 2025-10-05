import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import VerifyOtp from './pages/VerifyOtp'
import VerifyPage from './pages/VerifyPage'

import './styles.css'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path="/verify" element={<VerifyPage/>} />
        <Route path="/verify-otp" element={<VerifyOtp/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
