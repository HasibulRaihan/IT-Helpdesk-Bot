const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./db');
const app = express();

// Load environment variables
dotenv.config({ path: './api.env' });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');
const verifyRoute = require('./auth/verify');
const botRoute = require('./bot'); // AI bot endpoint

// API Endpoints
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api/verify', verifyRoute);
app.use('/api/chat', botRoute);

// Serve HTML pages manually (fallback)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/verify.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'verify.html'));
});

app.get('/help.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'help.html'));
});

// Fallback for any unknown route
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
