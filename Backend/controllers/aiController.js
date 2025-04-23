const User = require('../models/User');
const fetch = require('node-fetch');

// Enhance resume using AI (DeepInfra API)
const enhanceResume = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    const response = await fetch("https://api.deepinfra.com/v1/inference/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
      }),
    });

    const data = await response.json();
    console.log('DeepInfra Response:', data);

    const enhancedText = data.results?.[0]?.generated_text || "AI failed to enhance resume";

    const user = await User.findById(userId);
    if (user) {
      user.enhancedResume = enhancedText;
      await user.save();
    }

    res.status(200).json({ enhancedResume: enhancedText });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'Something went wrong while enhancing resume.' });
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
