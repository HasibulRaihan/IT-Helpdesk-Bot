const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const connectDB = require('./db');

// Route imports
const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');
const verifyRoute = require('./auth/verify');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
}));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Auth routes
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api/verify', verifyRoute);

// Smart chatbot API (Cohere)
const cohere = require('cohere-ai');
cohere.init(process.env.COHERE_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "Message is required" });

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: `You are a helpful IT Helpdesk Assistant.\nUser: ${userMessage}\nBot:`,
      max_tokens: 100,
      temperature: 0.7,
    });

    const botReply = response.body.generations[0].text.trim();
    res.json({ reply: botReply });
  } catch (err) {
    console.error('Cohere error:', err.message);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Serve frontend HTML routes
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

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
