import { testScenarios } from '../utils/testScenarios.js';

/**
 * Analyze test coverage based on comprehensive test scenarios
 */
export function analyzeCoverage(appType, testCases) {
  const allScenarios = testScenarios[appType] || testScenarios.web;
  const currentTestTitles = testCases.map(tc => tc.title.toLowerCase());

  const covered = [];
  const missing = [];

  allScenarios.forEach(scenario => {
    const isCovered = currentTestTitles.some(title => 
      similarity(title, scenario.title.toLowerCase()) > 0.6
    );

    if (isCovered) {
      covered.push(scenario);
    } else {
      missing.push(scenario);
    }
  });

  const coveragePercentage = Math.round((covered.length / allScenarios.length) * 100);

  return {
    percentage: coveragePercentage,
    covered,
    missing,
    totalScenarios: allScenarios.length,
    coveredCount: covered.length,
    missingCount: missing.length
  };
}

/**
 * Get suggested test cases for missing coverage
 */
export function getSuggestedTests(appType, testCases, selectedAreas) {
  const coverage = analyzeCoverage(appType, testCases);
  
  let missing = coverage.missing;
  
  // Filter by selected areas if provided
  if (selectedAreas && Array.isArray(selectedAreas) && selectedAreas.length > 0) {
    missing = missing.filter(scenario => selectedAreas.includes(scenario.area));
  }

  // Generate detailed test cases from scenarios
  const nextId = testCases.length + 1;
  
  return missing.map((scenario, index) => ({
    id: `TC-${String(nextId + index).padStart(3, '0')}`,
    title: scenario.title,
    type: 'Functional',
    priority: scenario.priority,
    precondition: generatePrecondition(scenario),
    steps: generateSteps(scenario),
    expectedResult: generateExpectedResult(scenario)
  }));
}

/**
 * Calculate similarity between two strings
 */
function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/**
 * Generate precondition for a test scenario
 */
function generatePrecondition(scenario) {
  return `User has access to the application. ${scenario.area} functionality is available and testable. All prerequisite data and configurations are in place.`;
}

/**
 * Generate test steps based on the scenario area
 */
function generateSteps(scenario) {
  const stepsMap = {
    'Authentication': [
      'Navigate to the authentication page',
      'Enter the required credentials',
      'Click the submit/login button',
      'Observe the authentication result'
    ],
    'Form Validation': [
      'Navigate to the form',
      'Enter test data into the fields',
      'Attempt to submit the form',
      'Verify validation messages appear correctly'
    ],
    'Navigation': [
      'Access the application',
      'Locate the navigation element',
      'Click on the navigation item',
      'Verify correct page/section loads'
    ],
    'Security': [
      'Attempt to exploit the security vulnerability',
      'Enter malicious input or perform unauthorized action',
      'Verify the system blocks or sanitizes the attempt',
      'Check security logs if available'
    ],
    'Performance': [
      'Set up performance monitoring tools',
      'Execute the action being tested',
      'Measure the response time or load time',
      'Verify performance meets requirements'
    ]
  };

  return stepsMap[scenario.area] || [
    'Navigate to the feature being tested',
    'Perform the test action',
    'Observe the result',
    'Verify expected behavior'
  ];
}

/**
 * Generate expected result for a test scenario
 */
function generateExpectedResult(scenario) {
  return `${scenario.title.replace('Verify ', '')} should work as expected. The system should handle this scenario correctly without errors, and all functionality should perform according to requirements and specifications.`;
}
