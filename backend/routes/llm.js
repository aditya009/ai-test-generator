import express from 'express';
import { generateTestCases } from '../services/llmService.js';

const router = express.Router();

/**
 * POST /api/llm/generate
 * Generate test cases using LLM
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      provider,        // 'openai', 'gemini', or 'ollama'
      apiKey,          // User's API key (if not using env)
      appType,         // 'web', 'mobile', or 'dashboard'
      storyId,
      storyDescription,
      promptMode,      // 'auto', 'prompt2', or 'custom'
      customPrompt
    } = req.body;

    // Validation
    if (!provider) {
      return res.status(400).json({ error: 'LLM provider is required' });
    }

    if (!storyDescription) {
      return res.status(400).json({ error: 'User story description is required' });
    }

    if (!appType) {
      return res.status(400).json({ error: 'Application type is required' });
    }

    const finalApiKey = apiKey || process.env[`${provider.toUpperCase()}_API_KEY`];
    
    if (!finalApiKey && provider !== 'ollama') {
      return res.status(400).json({ 
        error: `API key is required for ${provider}. Please provide it in the request or set ${provider.toUpperCase()}_API_KEY in your environment.` 
      });
    }

    console.log(`Generating test cases using ${provider} for ${appType} application...`);

    // Generate test cases
    const testCases = await generateTestCases({
      provider,
      apiKey: finalApiKey,
      appType,
      storyId,
      storyDescription,
      promptMode,
      customPrompt
    });

    res.json({
      success: true,
      testCases,
      count: testCases.length,
      storyId
    });

  } catch (error) {
    console.error('Error generating test cases:', error);
    
    // Send detailed error message
    const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to generate test cases';
    
    res.status(500).json({
      error: 'Failed to generate test cases',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * POST /api/llm/validate-key
 * Validate LLM API key
 */
router.post('/validate-key', async (req, res) => {
  try {
    const { provider, apiKey } = req.body;

    if (!provider || !apiKey) {
      return res.status(400).json({ error: 'Provider and API key are required' });
    }

    // TODO: Implement actual validation logic for each provider
    const isValid = apiKey.length > 10; // Simple validation for now

    res.json({
      valid: isValid,
      provider
    });

  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(500).json({
      error: 'Failed to validate API key',
      message: error.message
    });
  }
});

export default router;
