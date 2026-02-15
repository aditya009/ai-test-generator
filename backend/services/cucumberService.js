/**
 * Cucumber/Gherkin conversion service
 * Converts test cases to BDD format with step definitions
 */

/**
 * Convert test case to Cucumber Feature file
 */
export function convertToFeatureFile(testCase, storyDescription = '') {
  const featureName = extractFeatureName(testCase.title);
  const tags = generateTags(testCase);
  const background = generateBackground(testCase);
  const scenario = generateScenario(testCase);

  return `Feature: ${featureName}
  As a user
  I want to ${testCase.title.toLowerCase()}
  So that ${extractUserGoal(storyDescription, testCase)}

${background ? background + '\n' : ''}  ${tags}
  Scenario: ${testCase.title}
${scenario}
`;
}

/**
 * Generate step definitions for selected framework
 */
export function generateStepDefinitions(testCase, framework = 'playwright') {
  const steps = parseTestSteps(testCase);
  return generatePlaywrightSteps(steps, testCase);
}

/**
 * Convert batch of test cases to complete Cucumber suite
 */
export function convertBatchToFeatures(testCases, storyDescription = '') {
  const features = testCases.map(tc => ({
    filename: `${tc.id.toLowerCase()}.feature`,
    content: convertToFeatureFile(tc, storyDescription)
  }));

  return features;
}

/**
 * Parse test steps into Given/When/Then format
 */
function parseTestSteps(testCase) {
  const steps = Array.isArray(testCase.steps) ? testCase.steps : [testCase.steps];
  const parsed = [];

  steps.forEach((step, index) => {
    const lowerStep = step.toLowerCase();
    let keyword = 'And';

    // Determine step keyword based on content
    if (index === 0 || lowerStep.includes('precondition') || lowerStep.includes('given')) {
      keyword = 'Given';
    } else if (lowerStep.includes('navigate') || lowerStep.includes('open') || lowerStep.includes('go to')) {
      keyword = 'Given';
    } else if (lowerStep.includes('click') || lowerStep.includes('enter') || lowerStep.includes('select') || 
               lowerStep.includes('type') || lowerStep.includes('input') || lowerStep.includes('submit') ||
               lowerStep.includes('perform') || lowerStep.includes('send')) {
      keyword = 'When';
    } else if (lowerStep.includes('verify') || lowerStep.includes('check') || lowerStep.includes('should') || 
               lowerStep.includes('see') || lowerStep.includes('display') || lowerStep.includes('expect') ||
               lowerStep.includes('validate') || lowerStep.includes('confirm')) {
      keyword = 'Then';
    } else if (index < steps.length / 2) {
      keyword = 'When';
    } else {
      keyword = 'Then';
    }

    parsed.push({
      keyword,
      text: cleanStepText(step),
      original: step
    });
  });

  return parsed;
}

/**
 * Generate Scenario section with steps
 */
function generateScenario(testCase) {
  const steps = parseTestSteps(testCase);
  
  return steps.map(step => `    ${step.keyword} ${step.text}`).join('\n');
}

/**
 * Generate Background section if applicable
 */
function generateBackground(testCase) {
  if (!testCase.precondition || testCase.precondition === '') {
    return '';
  }

  const preconditions = testCase.precondition.split(/[;.\n]/).filter(p => p.trim().length > 0);
  
  if (preconditions.length === 0) return '';

  const steps = preconditions.map(p => `    And ${cleanStepText(p)}`).join('\n');
  
  return `  Background:
    Given the application is running
${steps}`;
}

/**
 * Generate tags from test case metadata
 */
function generateTags(testCase) {
  const tags = [];
  
  tags.push(`@${testCase.id.toLowerCase()}`);
  
  if (testCase.priority) {
    tags.push(`@${testCase.priority.toLowerCase()}-priority`);
  }
  
  if (testCase.type) {
    tags.push(`@${testCase.type.toLowerCase()}`);
  }

  // Add smart tags based on title
  const title = testCase.title.toLowerCase();
  if (title.includes('login') || title.includes('auth')) tags.push('@authentication');
  if (title.includes('smoke')) tags.push('@smoke');
  if (title.includes('regression')) tags.push('@regression');
  if (title.includes('security')) tags.push('@security');
  if (title.includes('api')) tags.push('@api');
  
  return tags.join(' ');
}

/**
 * Generate Playwright step definitions
 */
function generatePlaywrightSteps(steps, testCase) {
  const stepDefs = steps.map(step => {
    const cucumberStep = `${step.keyword}('${step.text}', async ({ page }) => {`;
    const code = generatePlaywrightCode(step);
    
    return `${cucumberStep}
  ${code}
});`;
  }).join('\n\n');

  return `import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

${stepDefs}`;
}

/**
 * Generate Playwright code for a step
 */
function generatePlaywrightCode(step) {
  const lowerText = step.original.toLowerCase();
  
  if (lowerText.includes('navigate') || lowerText.includes('open') || lowerText.includes('go to')) {
    return `await page.goto('https://example.com');`;
  } else if (lowerText.includes('click')) {
    return `await page.click('#elementId');`;
  } else if (lowerText.includes('enter') || lowerText.includes('type') || lowerText.includes('input')) {
    return `await page.fill('#inputId', 'test data');`;
  } else if (lowerText.includes('select')) {
    return `await page.selectOption('#dropdownId', 'option');`;
  } else if (lowerText.includes('verify') || lowerText.includes('should') || lowerText.includes('see')) {
    return `await expect(page.locator('#elementId')).toHaveText('Expected Text');`;
  } else {
    return `// TODO: Implement - ${step.original}`;
  }
}

/**
 * Helper functions
 */
function extractFeatureName(title) {
  // Remove "Verify", "Test", "Check" prefixes
  return title
    .replace(/^(Verify|Test|Check)\s+/i, '')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function extractUserGoal(storyDescription, testCase) {
  if (storyDescription && storyDescription.includes('So that')) {
    const match = storyDescription.match(/So that (.+)/i);
    if (match) return match[1].trim();
  }
  return `the ${testCase.title.toLowerCase()} works correctly`;
}

function cleanStepText(text) {
  return text
    .replace(/^Step \d+:?\s*/i, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
}

function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (m) => m.toLowerCase());
}

function toMethodName(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 50);
}
