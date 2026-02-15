# AI Test Generator - Backend

Node.js + Express backend for AI-powered test case generation.

## Features

- ✅ OpenAI, Gemini, and Ollama integration
- ✅ JIRA API integration
- ✅ Coverage analysis
- ✅ TestRail & Zephyr Scale integration (coming soon)
- ✅ CSV/Excel export

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your API keys to `.env`

4. Start the server:
```bash
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Health Check
- `GET /health` - Check server status

### LLM
- `POST /api/llm/generate` - Generate test cases
- `POST /api/llm/validate-key` - Validate API key

### JIRA
- `POST /api/jira/fetch` - Fetch user stories
- `POST /api/jira/validate` - Validate credentials

### Coverage
- `POST /api/coverage/analyze` - Analyze test coverage
- `POST /api/coverage/suggest` - Get suggested tests

### Export
- `POST /api/export/csv` - Export to CSV
- `POST /api/export/excel` - Export to Excel

### Integration
- `POST /api/integration/testrail/push` - Push to TestRail
- `POST /api/integration/zephyr/push` - Push to Zephyr

## Environment Variables

Required for each LLM provider:
- `OPENAI_API_KEY` - For OpenAI
- `GEMINI_API_KEY` - For Google Gemini
- `OLLAMA_BASE_URL` - For local Ollama (default: http://localhost:11434)

Optional:
- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
- `TESTRAIL_URL`, `TESTRAIL_EMAIL`, `TESTRAIL_API_KEY`
- `ZEPHYR_API_TOKEN`, `ZEPHYR_API_REGION`
