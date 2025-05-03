const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { CohereClient } = require('cohere-ai');
const connectDB = require('./db');
const registerRoute = require('./auth/register');
const loginRoute = require('./auth/login');
const verifyRoute = require('./auth/verify');

// Load environment variables
dotenv.config({ path: './api.env' });

const app = express();
const PORT = process.env.PORT || 3978;

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});
app.use(limiter);

// Serve static HTML files from root directory
app.use(express.static(path.join(__dirname)));

// Root route → redirect to login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Cohere Init
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// API Routes
app.use('/api', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/verify', verifyRoute);

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: `You are an IT Helpdesk Bot. Be helpful, concise, and polite.\nUser: ${message}\nBot:`,
      maxTokens: 300,
      temperature: 0.7,
    });

    const reply = response.generations[0].text.trim();
    res.json({ reply });
  } catch (error) {
    console.error('Error generating reply:', error.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Helpdesk bot running on http://localhost:${PORT}`);
});





