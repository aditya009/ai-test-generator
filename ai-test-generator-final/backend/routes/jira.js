import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * POST /api/jira/fetch
 * Fetch user stories from JIRA
 */
router.post('/fetch', async (req, res) => {
  try {
    const { jiraUrl, jiraEmail, jiraToken, jiraLinks } = req.body;

    if (!jiraUrl || !jiraEmail || !jiraToken || !jiraLinks) {
      return res.status(400).json({ error: 'All JIRA credentials are required' });
    }

    const links = jiraLinks.split('\n').filter(link => link.trim());
    const stories = [];

    for (const link of links) {
      // Extract issue key from JIRA link (e.g., PROJ-123)
      const match = link.match(/([A-Z]+-\d+)/);
      if (!match) {
        console.warn(`Invalid JIRA link: ${link}`);
        continue;
      }

      const issueKey = match[1];
      
      try {
        const response = await axios.get(
          `${jiraUrl}/rest/api/3/issue/${issueKey}`,
          {
            auth: {
              username: jiraEmail,
              password: jiraToken
            },
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        const issue = response.data;
        stories.push({
          key: issue.key,
          summary: issue.fields.summary,
          description: issue.fields.description || '',
          status: issue.fields.status.name,
          type: issue.fields.issuetype.name
        });

      } catch (error) {
        console.error(`Error fetching ${issueKey}:`, error.message);
      }
    }

    if (stories.length === 0) {
      return res.status(404).json({ error: 'No stories found or unable to fetch from JIRA' });
    }

    res.json({
      success: true,
      stories,
      count: stories.length
    });

  } catch (error) {
    console.error('Error fetching from JIRA:', error);
    res.status(500).json({
      error: 'Failed to fetch from JIRA',
      message: error.message
    });
  }
});

/**
 * POST /api/jira/validate
 * Validate JIRA credentials
 */
router.post('/validate', async (req, res) => {
  try {
    const { jiraUrl, jiraEmail, jiraToken } = req.body;

    if (!jiraUrl || !jiraEmail || !jiraToken) {
      return res.status(400).json({ error: 'All JIRA credentials are required' });
    }

    // Test connection by fetching current user
    const response = await axios.get(
      `${jiraUrl}/rest/api/3/myself`,
      {
        auth: {
          username: jiraEmail,
          password: jiraToken
        }
      }
    );

    res.json({
      valid: true,
      user: response.data.displayName
    });

  } catch (error) {
    console.error('JIRA validation error:', error);
    res.status(401).json({
      valid: false,
      error: 'Invalid JIRA credentials'
    });
  }
});

export default router;
