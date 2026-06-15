# 🤖 AI Agent Hub — Powered by Gemini 2.0 Flash

A sleek, modern multi-agent AI platform featuring **10 specialized AI agents**, each expert-crafted for a specific business role. Built with React + Vite + Tailwind CSS, powered by Google Gemini 2.0 Flash on the backend.

![AI Agent Hub](https://img.shields.io/badge/Powered%20by-Gemini%202.0%20Flash-blue?style=for-the-badge&logo=google)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss)

---

## 🧠 The 10 AI Agents

| Agent | Role | Key Capabilities |
|-------|------|-----------------|
| 🤝 Sales Agent | Close deals & generate leads | Cold outreach, objection handling, pitch decks |
| 📧 Email Agent | Craft perfect emails | Follow-up sequences, newsletters, subject lines |
| 📊 Data Analyst | Turn data into decisions | SQL, trend analysis, KPIs, A/B testing |
| 🎯 Marketing Agent | Campaigns that convert | SEO, social media, ad copy, brand strategy |
| 💼 HR Agent | Build & manage great teams | Job descriptions, interviews, policies |
| 📝 Content Writer | Words that engage | Blog posts, scripts, social captions |
| 🛠️ Customer Support | Resolve issues fast | Response templates, de-escalation, FAQs |
| 💰 Finance Agent | Financials & forecasts | Budgets, P&L, financial modeling |
| ⚖️ Legal Agent | Contracts & compliance | NDAs, privacy policies, GDPR |
| 🚀 Product Manager | Ship great products | PRDs, roadmaps, user stories, OKRs |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key → [Get one here](https://aistudio.google.com/app/apikey)

### Installation

```bash
git clone https://github.com/bhandarihardik0607-max/ai-agent-hub.git
cd ai-agent-hub
npm install
npm run dev
```

### Environment Setup

Create a `.env` file in the root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend Function

The backend is a Deno serverless function (`functions/geminiAgent.ts`) deployed on Base44. It handles:
- Multi-turn conversation history
- Agent-specific system prompts
- Gemini 2.0 Flash API calls
- CORS headers

To deploy your own backend, update the `API_URL` constant in `src/pages/ChatPage.jsx`.

---

## 🏗️ Project Structure

```
ai-agent-hub/
├── src/
│   ├── components/
│   │   └── AgentCard.jsx      # Agent selection card
│   ├── pages/
│   │   ├── LandingPage.jsx    # Agent selector grid
│   │   └── ChatPage.jsx       # Chat interface
│   ├── styles/
│   │   └── index.css          # Tailwind + custom styles
│   ├── agents.js              # Agent configs & metadata
│   ├── App.jsx                # Root component
│   └── main.jsx               # Entry point
├── functions/
│   └── geminiAgent.ts         # Deno backend function
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## ✨ Features

- **Beautiful Landing Page** — Dark glassmorphism UI with animated agent cards
- **10 Expert Agents** — Each with carefully crafted system prompts
- **Multi-turn Chat** — Full conversation history per session
- **Markdown Rendering** — Formatted responses with code blocks, lists, tables
- **Copy to Clipboard** — One-click copy any AI response
- **Quick Prompts** — Capability pills for fast task selection
- **Responsive Design** — Works on mobile, tablet, desktop
- **Smooth Animations** — Polished transitions throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| AI Model | Google Gemini 2.0 Flash |
| Backend | Deno (serverless function) |
| Markdown | react-markdown |
| Icons | lucide-react |

---

## 📄 License

MIT License — feel free to fork, extend, and build upon this.

---

Built with ❤️ by Hardik
