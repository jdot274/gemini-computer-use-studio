# 🚀 Gemini Computer Use Studio

AI-powered CLI copilot UI with Gemini Computer Use integration. Terminal monitoring, auto-fix, and browser control.

## ✨ Features

- **Live Terminal Integration** - Real PTY with xterm.js
- **Gemini AI ReAct Loop** - Continuous planning & execution
- **Computer Use** - Browser automation via Playwright
- **Auto-Monitoring** - Detects errors and auto-fixes
- **No Manual Coding** - AI runs commands, edits files, checks results

## 🏗️ Architecture

```
gemini-computer-use-studio/
├── server/
│   ├── server.js          # Socket.IO + PTY backend
│   └── gemini-agent.js     # Gemini API ReAct loop
├── src/
│   ├── App.jsx            # Main UI layout
│   ├── components/
│   │   ├── ConversationPanel.jsx
│   │   ├── TerminalPanel.jsx
│   │   ├── CodeWorkspace.jsx
│   │   └── BrowserPanel.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 🔧 Setup

### Prerequisites
- Node.js 18+
- Google AI Studio API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/jdot274/gemini-computer-use-studio.git
cd gemini-computer-use-studio

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your GOOGLE_API_KEY to .env

# Run development server
npm run dev
```

## 🎯 Usage

1. **Start the app**: `npm run dev`
2. **Open browser**: http://localhost:5173
3. **Give instructions**: "Fix the failing tests and clean up lint errors"
4. **Watch it work**: Auto-runs commands, edits files, verifies results

### Mode Controls

- **Observe Mode**: Monitors terminal output for errors
- **Auto-run**: Executes shell commands automatically
- **Auto-edit**: Applies file changes automatically

## 📦 Dependencies

- `@google/generative-ai` - Gemini API
- `node-pty` - Terminal emulation
- `playwright` - Browser automation
- `socket.io` - Real-time communication
- `xterm` - Terminal UI
- `react` + `vite` - Frontend

## 🎬 How It Works

1. You type a command like "Refactor the auth module"
2. Gemini analyzes your repo + terminal output
3. Proposes a plan: shell commands, file edits, browser searches
4. Executes actions and monitors results
5. Auto-fixes errors until task completes

## 🔐 Environment Variables

```bash
GOOGLE_API_KEY=your_gemini_api_key_here
```

Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📝 License

MIT
