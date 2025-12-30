# 🚀 APOS - Autonomous Personal Operating System

> **From CLI Tool to Complete Operating Environment**

## 🎯 What is APOS?

APOS is not just another CLI tool—it's a complete **Autonomous Personal Operating System** that bridges the gap between human intent and system execution across all computing surfaces:

- 🖥️ **Terminal**: Real PTY integration with intelligent command execution
- 🌍 **Browser**: Full automation and control via Playwright
- 📁 **Files**: Workspace monitoring with git integration
- ☁️ **Cloud**: Multi-provider infrastructure automation
- 🧠 **AI**: Continuous planning, execution, and auto-fix loop

### Core Philosophy

Traditional CLI tools require manual coding, explicit commands, and constant human intervention. APOS flips this model:

1. **You provide intent** ("Fix the failing tests")
2. **AI plans the approach** (analyze errors, generate fixes)
3. **Kernel executes autonomously** (runs commands, edits files, checks results)
4. **System self-corrects** (detects errors, generates fixes, retries)
5. **You approve when needed** (dangerous operations require confirmation)

---

# 🚀 Gemini Computer Use Studio

AI-powered CLI copilot UI with Gemini Computer Use integration. Terminal monitoring, auto-fix, and browser control.

## ✨ Features

- **Live Terminal Integration** - Real PTY with xterm.js
- **Gemini AI ReAct Loop** - Continuous planning & execution
- **Computer Use** - Browser automation via Playwright
- **Auto-Monitoring** - Detects errors and auto-fixes
- **No Manual Coding** - AI runs commands, edits files, checks results

## 🏗️ Architecture

For comprehensive architectural documentation, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.


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
