# AI Test Generator - Frontend

React + Vite frontend for AI-powered test case generation.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

## 📋 Prerequisites

- Node.js 18+ installed
- Backend server running on http://localhost:3001

## 🎯 Features

- ✅ 5-step workflow (Setup → Generate → Coverage → Review → Export)
- ✅ Real-time AI test case generation
- ✅ JIRA integration
- ✅ Coverage analysis with visual dashboard
- ✅ CSV/Excel export
- ✅ TestRail/Zephyr integration

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS** - Styling (no framework needed)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── Header.jsx
│   │   ├── Stepper.jsx
│   │   ├── Step1Setup.jsx (create these)
│   │   └── ...
│   ├── services/
│   │   └── api.js        # API client
│   ├── styles/
│   │   └── index.css     # Global styles
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🔧 Configuration

Create `.env.local`:
```
VITE_API_URL=http://localhost:3001
```

## 🚀 Build for Production

```bash
npm run build
```

Output in `dist/` folder.

## 📝 Next Steps

The following components need to be created:
- `Step1Setup.jsx` - LLM & story configuration
- `Step2Generate.jsx` - Test case generation
- `Step3Coverage.jsx` - Coverage analysis
- `Step4Review.jsx` - Review test cases
- `Step5Export.jsx` - Export & integrations

**Note**: The App.jsx and services are ready. Just need to create the step components based on the exact HTML structure we built earlier.

## 🌐 Deployment

Deploy to Vercel:
```bash
npm run build
vercel deploy
```

Or Netlify:
```bash
npm run build
netlify deploy --prod --dir=dist
```
