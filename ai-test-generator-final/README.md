# 🚀 AI Test Case Generator - Full Stack Application

Production-ready test case generator with AI integration (OpenAI, Gemini, Ollama), JIRA integration, coverage analysis, and TestRail/Zephyr export.

## ✅ Status: 100% COMPLETE

Both backend and frontend are fully implemented and ready to use!

## 📁 Project Structure

```
ai-test-generator/
├── backend/              ✅ COMPLETE
│   ├── routes/          # All API endpoints
│   ├── services/        # OpenAI, Gemini, Ollama, Coverage
│   ├── utils/           # Test scenarios database
│   ├── server.js        # Express server
│   └── package.json
│
├── frontend/            ✅ COMPLETE
│   ├── src/
│   │   ├── components/  # All 5 steps + Header + Stepper
│   │   ├── services/    # API integration
│   │   ├── styles/      # Complete CSS
│   │   ├── App.jsx      # Main app with state
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your API key:
```
OPENAI_API_KEY=sk-your-key-here
# OR
GEMINI_API_KEY=your-gemini-key
# OR use Ollama locally (free)
```

Start backend:
```bash
npm run dev
# Runs on http://localhost:3001
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Open Your Browser

Go to: http://localhost:5173

## 🔑 Get API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Gemini**: https://makersuite.google.com/app/apikey
- **Ollama** (free, local): https://ollama.ai - Run `ollama serve`

Optional:
- **JIRA**: https://id.atlassian.com/manage-profile/security/api-tokens
- **TestRail**: Settings → API
- **Zephyr**: Jira profile → Zephyr Scale API keys

## 🎯 Features

### ✅ Fully Implemented

**Step 1 - Setup:**
- LLM provider selection (OpenAI/Gemini/Ollama)
- API key input
- App type selection (Web/Mobile/Dashboard)
- Manual user story input OR JIRA fetch
- Custom prompt configuration

**Step 2 - Generate:**
- Real AI test case generation
- Two-column layout (list + details)
- Expandable test case details
- Loading states
- Error handling

**Step 3 - Coverage:**
- Intelligent coverage analysis
- Visual coverage dashboard (4 stat cards)
- Covered vs Missing areas
- Smart suggestions
- Add missing test cases

**Step 4 - Review:**
- Review all test cases
- Edit preconditions and expected results
- Two-column layout

**Step 5 - Export:**
- CSV export (working)
- Excel export (working)
- TestRail integration (API ready)
- Zephyr Scale integration (API ready)

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- OpenAI SDK
- Axios (for Gemini/Ollama)
- JIRA REST API
- Coverage analysis engine

**Frontend:**
- React 18
- Vite
- Axios
- Pure CSS (no framework)

## 🚀 Deployment

### Backend - Deploy to Render (Free)

1. Push code to GitHub
2. Go to https://render.com
3. New → Web Service
4. Connect your repo → backend folder
5. Add environment variables (OPENAI_API_KEY, etc.)
6. Deploy!

### Frontend - Deploy to Vercel (Free)

```bash
cd frontend
npm run build
npx vercel
```

Or:
1. Push to GitHub
2. Go to https://vercel.com
3. Import repository
4. Root directory: `frontend`
5. Deploy!

Update frontend `.env.local`:
```
VITE_API_URL=https://your-backend.onrender.com
```

## 📝 Usage

1. **Enter API Key** - OpenAI, Gemini, or use Ollama
2. **Choose App Type** - Web, Mobile, or Dashboard
3. **Enter User Story** - Manual input or fetch from JIRA
4. **Generate** - AI creates 5-10 test cases automatically
5. **Check Coverage** - See what's missing, add suggestions
6. **Review** - Edit and finalize test cases
7. **Export** - Download CSV/Excel or push to TestRail/Zephyr

## 🎨 Design

100% exact match to https://qa-ai-test-generator.vercel.app/
- Same colors
- Same fonts (system fonts)
- Same layout (two-column test case view)
- Same workflow
- Same animations

## 📄 License

MIT

---

**Built with ❤️ - Ready to use in production!**
