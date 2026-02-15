import OpenAI from 'openai';
import axios from 'axios';

/**
 * Generate test cases using the specified LLM provider
 */
export async function generateTestCases(config) {
  const { provider, apiKey, appType, storyId, storyDescription, promptMode, customPrompt } = config;

  // Build the prompt
  const prompt = buildPrompt(appType, storyDescription, promptMode, customPrompt);

  console.log(`Using provider: ${provider}`);

  switch (provider.toLowerCase()) {
    case 'openai':
      return await generateWithOpenAI(apiKey, prompt, storyId);
    
    case 'gemini':
      return await generateWithGemini(apiKey, prompt, storyId);
    
    case 'ollama':
      return await generateWithOllama(prompt, storyId);
    
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

/**
 * Build the AI prompt based on configuration
 */
function buildPrompt(appType, storyDescription, promptMode, customPrompt) {
  const baseContext = `You are an expert QA engineer creating comprehensive test cases for a ${appType} application.`;

  const appTypeGuidance = {
    web: 'Focus on browser compatibility, form validation, navigation, security (XSS, CSRF), authentication, and responsive design.',
    mobile: 'Focus on touch gestures, device orientation, permissions, offline mode, push notifications, battery usage, and different screen sizes.',
    dashboard: 'Focus on widget functionality, data visualization, filtering, export features, real-time updates, and performance with large datasets.'
  };

  const formatInstructions = `
Generate 5-10 comprehensive test cases and return them as a JSON array.

IMPORTANT: Return ONLY a JSON array, nothing else. No markdown, no explanations, just the array.

Each test case in the array must have this exact structure:
{
  "id": "TC-001",
  "title": "Descriptive test case title",
  "type": "Functional",
  "priority": "High",
  "precondition": "Prerequisites needed before running this test",
  "steps": ["Step 1 description", "Step 2 description", "Step 3 description"],
  "expectedResult": "What should happen when the test passes"
}

Requirements:
- Generate 5-10 test cases
- Include positive, negative, and edge case scenarios
- Prioritize test cases as High, Medium, or Low
- Be specific and detailed in steps (3-5 steps per test)
- ${appTypeGuidance[appType]}
- Return a JSON array starting with [ and ending with ]
`;

  if (promptMode === 'custom' && customPrompt) {
    return `${baseContext}\n\n${customPrompt}\n\nUser Story:\n${storyDescription}\n\n${formatInstructions}`;
  }

  // Auto mode - default prompt
  return `${baseContext}

Generate comprehensive test cases for the following user story:

${storyDescription}

${formatInstructions}`;
}

/**
 * Generate test cases using OpenAI
 * Automatically tries multiple models for compatibility
 */
async function generateWithOpenAI(apiKey, prompt, storyId) {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const openai = new OpenAI({ apiKey });

  console.log('Calling OpenAI API...');

  // List of OpenAI models to try (in order of preference)
  const modelsToTry = [
    'gpt-4-turbo-preview',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo',
    'gpt-4o-mini',
    'gpt-4o'
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Trying OpenAI model: ${model}...`);

      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert QA engineer. You must respond with a valid JSON array of test cases. Each test case must have: id, title, type, priority, precondition, steps (array), and expectedResult.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      console.log(`✅ Success with ${model}!`);

      const content = completion.choices[0].message.content;
      console.log('OpenAI response received');
      console.log('Raw response:', content.substring(0, 200));

      // Parse the JSON response - handle markdown code blocks
      let testCases;
      try {
        // Clean up markdown if present
        let jsonText = content.trim();
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/```\n?/g, '');
        }

        const parsed = JSON.parse(jsonText);
        
        // Handle different possible response structures
        if (Array.isArray(parsed)) {
          testCases = parsed;
        } else if (parsed.testCases && Array.isArray(parsed.testCases)) {
          testCases = parsed.testCases;
        } else if (parsed.test_cases && Array.isArray(parsed.test_cases)) {
          testCases = parsed.test_cases;
        } else if (typeof parsed === 'object') {
          // If it's a single object, wrap it in an array
          testCases = [parsed];
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (error) {
        console.error('Failed to parse OpenAI response:', error.message);
        console.error('Content:', content);
        throw new Error('Invalid JSON response from OpenAI: ' + error.message);
      }

      return formatTestCases(testCases, storyId);

    } catch (error) {
      lastError = error;
      console.log(`❌ Failed with ${model}: ${error.message}`);
      
      // If it's an auth error, don't try other models
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your API key and try again.');
      }
      
      // If it's a rate limit, don't try other models
      if (error.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please wait or try a different provider.');
      }

      // Continue to next model
      continue;
    }
  }

  // If we got here, all models failed
  console.error('All OpenAI models failed. Last error:', lastError?.message);
  throw new Error(`OpenAI API failed: ${lastError?.message || 'Unknown error'}. Your API key may not have access to GPT-4 models. Try adding credits or use Gemini/Ollama instead.`);
}

/**
 * Generate test cases using Google Gemini
 * Automatically tries multiple models/endpoints for compatibility
 */
async function generateWithGemini(apiKey, prompt, storyId) {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  console.log('Calling Gemini API...');

  // Updated list based on actual available models (2024-2025)
  const modelsToTry = [
    { name: 'gemini-2.5-flash', version: 'v1' },
    { name: 'gemini-2.0-flash', version: 'v1' },
    { name: 'gemini-2.5-pro', version: 'v1' },
    { name: 'gemini-2.0-flash-lite', version: 'v1' },
    { name: 'gemini-2.5-flash-lite', version: 'v1' }
  ];

  let lastError = null;

  // Try each model until one works
  for (const model of modelsToTry) {
    try {
      console.log(`Trying Gemini model: ${model.name} (${model.version})...`);
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
          }
        },
        {
          timeout: 30000, // 30 second timeout
          validateStatus: (status) => status === 200 // Only accept 200
        }
      );

      // If we got here, the request succeeded!
      console.log(`✅ Success with ${model.name}!`);

      const content = response.data.candidates[0].content.parts[0].text;
      console.log('Gemini response received');

      // Clean up markdown if present
      let jsonText = content.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      // Try to find JSON array in the response
      const arrayStart = jsonText.indexOf('[');
      const arrayEnd = jsonText.lastIndexOf(']');
      
      if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
        jsonText = jsonText.substring(arrayStart, arrayEnd + 1);
      }

      let testCases;
      try {
        const parsed = JSON.parse(jsonText);
        
        if (Array.isArray(parsed)) {
          testCases = parsed;
        } else if (parsed.testCases && Array.isArray(parsed.testCases)) {
          testCases = parsed.testCases;
        } else if (parsed.test_cases && Array.isArray(parsed.test_cases)) {
          testCases = parsed.test_cases;
        } else if (typeof parsed === 'object') {
          testCases = [parsed];
        } else {
          throw new Error('Unexpected response structure');
        }
        
        // Filter out incomplete test cases
        testCases = testCases.filter(tc => tc.title && tc.id);
        
        if (testCases.length === 0) {
          throw new Error('No valid test cases found in response');
        }
        
      } catch (error) {
        console.error('Failed to parse Gemini response:', error.message);
        console.error('Attempted to parse:', jsonText.substring(0, 500));
        
        // Return fallback test case
        console.log('Returning fallback test cases due to parsing error');
        return formatTestCases([
          {
            id: 'TC-001',
            title: 'Basic functionality test',
            type: 'Functional',
            priority: 'High',
            precondition: 'System is accessible and user has valid credentials',
            steps: ['Navigate to the feature', 'Perform the action', 'Verify the result'],
            expectedResult: 'Feature works as expected'
          }
        ], storyId);
      }

      return formatTestCases(testCases, storyId);
      
    } catch (error) {
      lastError = error;
      console.log(`❌ Failed with ${model.name}: ${error.message}`);
      
      // Continue to next model
      continue;
    }
  }

  // If we got here, all models failed
  console.error('All Gemini models failed. Last error:', lastError?.message);
  
  if (lastError?.response?.status === 403) {
    throw new Error('Invalid Gemini API key. Please check your API key and try again.');
  } else if (lastError?.response?.status === 429) {
    throw new Error('Gemini rate limit exceeded. Please wait a moment and try again.');
  } else {
    throw new Error(`Gemini API failed: ${lastError?.message || 'Unknown error'}. Please check your API key or try Ollama instead.`);
  }
}

/**
 * Generate test cases using Ollama (local)
 */
async function generateWithOllama(prompt, storyId) {
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  console.log(`Calling Ollama API at ${ollamaUrl}...`);

  try {
    const response = await axios.post(`${ollamaUrl}/api/generate`, {
      model: 'llama3.2',
      prompt: prompt,
      stream: false
    });

    const content = response.data.response;
    console.log('Ollama response received');
    console.log('Raw response length:', content.length);

    // Clean up markdown if present
    let jsonText = content.trim();
    
    // Remove markdown code blocks
    if (jsonText.includes('```json')) {
      const start = jsonText.indexOf('```json') + 7;
      const end = jsonText.lastIndexOf('```');
      if (end > start) {
        jsonText = jsonText.substring(start, end).trim();
      }
    } else if (jsonText.includes('```')) {
      const start = jsonText.indexOf('```') + 3;
      const end = jsonText.lastIndexOf('```');
      if (end > start) {
        jsonText = jsonText.substring(start, end).trim();
      }
    }

    // Try to find JSON array in the response
    const arrayStart = jsonText.indexOf('[');
    const arrayEnd = jsonText.lastIndexOf(']');
    
    if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
      jsonText = jsonText.substring(arrayStart, arrayEnd + 1);
    }

    let testCases;
    try {
      const parsed = JSON.parse(jsonText);
      
      // Handle different possible response structures
      if (Array.isArray(parsed)) {
        testCases = parsed;
      } else if (parsed.testCases && Array.isArray(parsed.testCases)) {
        testCases = parsed.testCases;
      } else if (parsed.test_cases && Array.isArray(parsed.test_cases)) {
        testCases = parsed.test_cases;
      } else if (typeof parsed === 'object') {
        testCases = [parsed];
      } else {
        throw new Error('Unexpected response structure');
      }
      
      // Filter out incomplete test cases
      testCases = testCases.filter(tc => tc.title && tc.id);
      
      if (testCases.length === 0) {
        throw new Error('No valid test cases found in response');
      }
      
    } catch (error) {
      console.error('Failed to parse Ollama response:', error.message);
      console.error('Attempted to parse:', jsonText.substring(0, 500));
      
      // If parsing fails completely, return a fallback test case
      console.log('Returning fallback test cases due to parsing error');
      return formatTestCases([
        {
          id: 'TC-001',
          title: 'Basic functionality test',
          type: 'Functional',
          priority: 'High',
          precondition: 'System is accessible and user has valid credentials',
          steps: ['Navigate to the feature', 'Perform the action', 'Verify the result'],
          expectedResult: 'Feature works as expected'
        }
      ], storyId);
    }

    return formatTestCases(testCases, storyId);

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Ollama is not running. Please start Ollama first: ollama serve');
    }
    throw error;
  }
}

/**
 * Format and validate test cases
 */
function formatTestCases(testCases, storyId) {
  return testCases.map((tc, index) => ({
    id: tc.id || `TC-${String(index + 1).padStart(3, '0')}`,
    title: tc.title || 'Untitled test case',
    type: tc.type || 'Functional',
    priority: tc.priority || 'Medium',
    precondition: tc.precondition || '',
    steps: Array.isArray(tc.steps) ? tc.steps : [tc.steps || 'No steps provided'],
    expectedResult: tc.expectedResult || tc.expected_result || ''
  }));
}
