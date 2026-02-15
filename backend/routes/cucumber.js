import express from 'express';
import { 
  convertToFeatureFile, 
  generateStepDefinitions,
  convertBatchToFeatures
} from '../services/cucumberService.js';

const router = express.Router();

/**
 * POST /api/cucumber/convert
 * Convert single test case to Cucumber feature + steps
 */
router.post('/convert', async (req, res) => {
  try {
    const { testCase, framework, storyDescription } = req.body;

    if (!testCase) {
      return res.status(400).json({ error: 'Test case is required' });
    }

    console.log(`Converting ${testCase.id} to Cucumber with ${framework || 'selenium'}`);

    const featureFile = convertToFeatureFile(testCase, storyDescription);
    const stepDefinitions = generateStepDefinitions(testCase, 'playwright');

    const featureFilename = `${testCase.id.toLowerCase()}.feature`;
    const stepsFilename = `${testCase.id.toLowerCase()}.steps.ts`;

    res.json({
      success: true,
      featureFile: {
        content: featureFile,
        filename: featureFilename
      },
      stepDefinitions: {
        content: stepDefinitions,
        filename: stepsFilename
      },
      framework: 'playwright',
      testCaseId: testCase.id
    });

  } catch (error) {
    console.error('Error converting to Cucumber:', error);
    res.status(500).json({
      error: 'Failed to convert to Cucumber',
      message: error.message
    });
  }
});

/**
 * POST /api/cucumber/batch
 * Convert multiple test cases to Cucumber features
 */
router.post('/batch', async (req, res) => {
  try {
    const { testCases, framework, storyDescription } = req.body;

    if (!testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: 'Test cases array is required' });
    }

    console.log(`Batch converting ${testCases.length} test cases to Cucumber`);

    const features = convertBatchToFeatures(testCases, storyDescription);
    
    const stepDefinitions = testCases.map(testCase => {
      const steps = generateStepDefinitions(testCase, 'playwright');
      const filename = `${testCase.id.toLowerCase()}.steps.ts`;

      return {
        testCaseId: testCase.id,
        filename,
        content: steps
      };
    });

    res.json({
      success: true,
      features,
      stepDefinitions,
      count: testCases.length,
      framework: 'playwright'
    });

  } catch (error) {
    console.error('Error batch converting to Cucumber:', error);
    res.status(500).json({
      error: 'Failed to batch convert to Cucumber',
      message: error.message
    });
  }
});

export default router;
