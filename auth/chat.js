const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  // Optional: Use Cohere, OpenAI, etc. Replace the response below with real logic
  const reply = `Echo: ${message}`; 

  res.json({ reply });
});

module.exports = router;
