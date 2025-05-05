const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db');

// Import route handlers
const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');
const verifyRoute = require('./auth/verify');
const chatRoute = require('./auth/chat'); // ✅ New Chatbot route

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
}));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api/verify', verifyRoute);
app.use('/api/chat', chatRoute); // ✅ This enables chatbot connection

// HTML Routes
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
);
app.get('/login.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
);
app.get('/register.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'register.html'))
);
app.get('/verify.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'verify.html'))
);
app.get('/help.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'help.html'))
);

// Fallback 404
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
