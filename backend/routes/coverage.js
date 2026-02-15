import express from 'express';
import { analyzeCoverage, getSuggestedTests } from '../services/coverageService.js';

const router = express.Router();

/**
 * POST /api/coverage/analyze
 * Analyze test coverage
 */
router.post('/analyze', async (req, res) => {
  try {
    const { appType, testCases } = req.body;

    if (!appType) {
      return res.status(400).json({ error: 'Application type is required' });
    }

    if (!Array.isArray(testCases)) {
      return res.status(400).json({ error: 'Test cases must be an array' });
    }

    const coverage = analyzeCoverage(appType, testCases);

    res.json({
      success: true,
      coverage
    });

  } catch (error) {
    console.error('Error analyzing coverage:', error);
    res.status(500).json({
      error: 'Failed to analyze coverage',
      message: error.message
    });
  }
});

/**
 * POST /api/coverage/suggest
 * Get suggested test cases to improve coverage
 */
router.post('/suggest', async (req, res) => {
  try {
    const { appType, testCases, selectedAreas } = req.body;

    if (!appType) {
      return res.status(400).json({ error: 'Application type is required' });
    }

    const suggested = getSuggestedTests(appType, testCases || [], selectedAreas);

    res.json({
      success: true,
      suggested,
      count: suggested.length
    });

  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      message: error.message
    });
  }
});

export default router;
