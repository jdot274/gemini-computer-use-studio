# 🚀 APOS

**Autonomous Personal Operating System**

> A kernel-first, multi-surface autonomous execution environment with explicit authority boundaries, capability-oriented design, and verification guarantees.

---

## What Is APOS?

APOS is **not** a CLI copilot or terminal assistant.

It is a **complete operating environment** that:
- Manages execution across **multiple computing surfaces** (terminal, canvas, browser, APIs, native windows)
- Enforces **explicit permission boundaries** between surfaces
- Routes all application access through **MCPs (Model Context Protocols)**
- Executes autonomously with **verification-first loops**
- Maintains **kernel authority** over all processes

### The Core Model

```
┌─────────────────────────────────────────────┐
│             APOS Kernel                     │
│  - Process Management                       │
│  - Permission Enforcement                   │
│  - Capability Registry                      │
│  - Verification Engine                      │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴───────┐
       │   Surfaces    │
       └───────┬───────┘
               │
    ┌──────────┼──────────┬──────────┬─────────┐
    │          │          │          │         │
┌───▼───┐  ┌──▼──┐   ┌───▼────┐ ┌──▼───┐ ┌───▼────┐
│Terminal│  │Canvas│  │Browser │ │ APIs │ │Windows │
│(Trust) │  │(Coord)│ │(Confirm)│ │(MCP) │ │ (OS)   │
└────────┘  └──────┘  └────────┘ └──────┘ └────────┘
```

---

## Surface Model

### Terminal (Trusted Initiator)
- **Authority**: Full read/write/execute
- **Role**: Ground truth, user control surface
- **Restrictions**: None (user-authorized)

### Canvas (Coordination)
- **Authority**: Workflow orchestration, state visualization
- **Role**: Multi-step planning, verification display
- **Restrictions**: Cannot execute commands directly

### Browser (Controlled)
- **Authority**: Read DOM, limited interactions
- **Role**: Web automation, research, verification
- **Restrictions**: Confirmation required for navigation, form submission

### APIs (MCP-Only)
- **Authority**: Defined by capability registration
- **Role**: Application integrations (GitHub, Slack, AWS, etc.)
- **Restrictions**: All access routed through MCP layer, no direct API calls

### Native Windows (OS Access)
- **Authority**: Read UI state via accessibility APIs
- **Role**: Cross-application workflow automation
- **Restrictions**: Read-only by default, write requires explicit grant

---

## Architecture Principles

### 1. **Kernel Authority**
All execution flows through the APOS kernel. No surface can bypass permission checks.

### 2. **Capability Abstraction**
Features are registered as capabilities with:
- Permission requirements
- Resource constraints
- Verification criteria

### 3. **MCP-Governed Application Access**
No direct API calls. All application integrations use Model Context Protocols:
```typescript
// ❌ Wrong
await fetch('https://api.github.com/repos/...')

// ✅ Correct
await kernel.capability('github').execute({
  action: 'create_pr',
  verification: ['pr_url', 'status']
})
```

### 4. **Verification-First Execution**
Every operation defines success criteria **before** execution:
- Tests pass ✅
- Server responds with 200 ✅
- File contains expected content ✅

No "auto-fix until complete" without ground truth.

### 5. **Explicit Confirmation Gates**
Destructive or external operations require human confirmation:
- Browser navigation / form submission
- Cloud resource provisioning
- Data deletion
- Publishing / deployment

---

## Permission Matrix (Simplified)

| Surface    | Read | Write | Execute | External |
|------------|------|-------|---------|----------|
| Terminal   | ✅   | ✅    | ✅      | ✅       |
| Canvas     | ✅   | ✅    | ❌      | ❌       |
| Browser    | ✅   | 🔐    | 🔐      | 🔐       |
| APIs (MCP) | 🔐   | 🔐    | 🔐      | 🔐       |
| Windows    | ✅   | 🔐    | ❌      | ❌       |

- ✅ Allowed by default
- 🔐 Requires explicit permission grant
- ❌ Not permitted

---

## Implementation Status

### ✅ Phase 1: Foundation
- [x] Kernel implementation
- [x] Process management
- [x] Permission system
- [x] Capability registry
- [x] Type system
- [ ] Terminal adapter (in progress)
- [ ] Canvas surface (planned)

### 🔄 Phase 2: Multi-Surface
- [ ] Browser surface with confirmation gates
- [ ] MCP adapter layer
- [ ] Verification engine
- [ ] Native window bindings

### 📋 Phase 3: AI Integration
- [ ] Planning engine
- [ ] Execution monitor
- [ ] Auto-fix with verification
- [ ] Learning system

---

## Technology Stack

### Backend
- **Kernel**: TypeScript
- **Process Management**: node-pty
- **Communication**: Socket.io
- **MCP Layer**: Model Context Protocol adapters

### Frontend
- **Framework**: SvelteKit
- **Terminal**: xterm.js
- **Canvas**: Custom coordination UI
- **Design**: Tailwind + shadcn-svelte + premium components

### Execution
- **Terminal**: Real PTY via node-pty
- **Browser**: Playwright (implementation detail)
- **Windows**: OS accessibility APIs
- **APIs**: MCP connectors

---

## Quick Start

### Prerequisites
- Node.js 18+
- Google AI Studio API Key (for Gemini integration)

### Installation

```bash
# Clone repository
git clone https://github.com/jdot274/gemini-computer-use-studio.git
cd gemini-computer-use-studio

# Install dependencies
npm install

# Set API key
export GOOGLE_API_KEY=your_api_key_here

# Start development server
npm run dev
```

### Configuration

Edit `server/kernel/core.ts` to adjust kernel settings:
```typescript
const config: KernelConfig = {
  maxConcurrentProcesses: 10,
  memoryLimit: '2GB',
  cpuLimit: 80,
  sandboxEnabled: true,
  logLevel: 'info',
  persistenceEnabled: true
}
```

---

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture
- **API Reference** (coming soon)
- **MCP Integration Guide** (coming soon)
- **Security Model** (coming soon)

---

## Key Differences from CLI Copilots

| Feature | CLI Copilot | APOS |
|---------|-------------|------|
| **Model** | Tool/Assistant | Operating Environment |
| **Authority** | Implicit | Kernel-governed |
| **Surfaces** | Terminal only | Multi-surface with permissions |
| **App Access** | Direct API calls | MCP-only |
| **Verification** | Best-effort | Verification-first |
| **Permissions** | Assumed | Explicit grants |
| **Browser** | Optional add-on | First-class surface |

---

## Contributing

Contributions welcome! Please read our contribution guidelines (coming soon).

### Development

```bash
# Run kernel tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## License

MIT

---

## Lineage

APOS builds on concepts from:
- **Gemini Computer Use**: AI-driven terminal interaction
- **Model Context Protocol**: Standardized application access
- **Capability-based security**: Fine-grained permission models
- **Process calculi**: Formal models of concurrent computation

It is **categorically different** from:
- Terminal assistants (GitHub Copilot CLI, Warp AI)
- Task automation tools (Zapier, n8n)
- Browser automation frameworks (Playwright, Puppeteer)
- Low-code platforms (Make, Integromat)

APOS is an **autonomous operating environment**, not a productivity tool.
