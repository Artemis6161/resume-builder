const User = require('../models/User');
const fetch = require('node-fetch');

// Enhance resume using AI (DeepInfra API)
const axios = require('axios');

 const enhanceResume = async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = process.env.DEEPINFRA_API_KEY;

  console.log("Prompt received:", prompt);
  console.log("Using API Key:", apiKey ? "Yes" : "No");

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
const response = await axios.post(
  'https://api.deepinfra.com/v1/openai/chat/completions',
  {
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);


    console.log("DeepInfra response:", response.data);

    const aiMessage = response.data?.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return res.status(500).json({ enhancedResume: 'AI returned no content' });
    }

    return res.json({ enhancedResume: aiMessage });

  } catch (error) {
    console.error("DeepInfra Error:", error.response?.data || error.message);
    return res.status(500).json({ enhancedResume: 'AI failed to enhance resume' });
  }
};


// Get the stored enhanced resume
const getEnhancedResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user || !user.enhancedResume) {
      return res.status(404).json({ message: 'Enhanced resume not found' });
    }

    res.status(200).json({ enhancedResume: user.enhancedResume });
  } catch (err) {
    console.error('Fetch Resume Error:', err);
    res.status(500).json({ error: 'Failed to fetch enhanced resume' });
  }
};

module.exports = {
  enhanceResume,
  getEnhancedResume,
};