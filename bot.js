const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { CohereClient } = require('cohere-ai'); // Correct import for latest SDK

// Load environment variables from api.env
dotenv.config({ path: './api.env' });

const app = express();
const PORT = process.env.PORT || 3978;

// Security Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per minute
});
app.use(limiter);

// ✅ Correct Cohere Initialization
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

// Health Check Route
app.get('/', (req, res) => {
    res.send('🚀 IT Helpdesk Bot API is running');
});

// Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await cohere.generate({
            model: 'command-r-plus',
            prompt: `You are an IT Helpdesk Bot. Be helpful, concise, and polite.\nUser: ${message}\nBot:`,
            maxTokens: 300, // note: camelCase not snake_case
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



