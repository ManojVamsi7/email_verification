require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Email Verification Backend Running'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/email_verification', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> {
  console.log('MongoDB connected');
  app.listen(PORT, ()=> console.log('Server running on port', PORT));
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  app.listen(PORT, ()=> console.log('Server running on port', PORT, '(no DB)'));
});
