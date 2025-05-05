const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./db');

const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');
const verifyRoute = require('./auth/verify');

// Load environment variables
dotenv.config({ path: './api.env' });

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

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api/verify', verifyRoute);

// Serve HTML pages manually (Render needs this for routing)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/verify.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'verify.html')));
app.get('/help.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'help.html')));

// Catch-all route
app.use((req, res) => res.status(404).send('Page Not Found'));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

