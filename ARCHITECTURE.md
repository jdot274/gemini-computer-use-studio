# APOS Architecture

## Autonomous Personal Operating System

### Vision

APOS (Autonomous Personal Operating System) represents a paradigm shift from traditional CLI tools to a fully autonomous computing environment that bridges human intent with system execution across all surfaces.

### Core Philosophy

**From Tool to Environment**: APOS is not a CLI wrapper or automation script—it's a complete operating environment that:
- Understands context across terminal, browser, files, and cloud
- Executes autonomously with human oversight
- Learns and adapts to your workflow patterns
- Manages its own capabilities and permissions

## System Architecture

### Layer 1: Kernel

**Location**: `server/kernel/`

The kernel is the heart of APOS, responsible for:

#### Core (`core.ts`)
- Process lifecycle management
- Resource allocation and scheduling
- Event system and pub/sub
- State management and persistence
- Error recovery and resilience

```typescript
class Kernel {
  processes: Map<string, Process>
  capabilities: CapabilityRegistry
  permissions: PermissionManager
  
  spawn(command: string): Promise<Process>
  schedule(process: Process): void
  monitor(processId: string): Observable<ProcessEvent>
}
```

#### Capabilities (`capabilities.ts`)
Feature Capability Binding Layer that dynamically registers and manages:
- Filesystem operations
- Network access
- Git integration
- Docker/container control
- Cloud service APIs
- Browser automation
- AI model access

Each capability:
- Self-describes its requirements
- Requests necessary permissions
- Provides type-safe interfaces
- Handles initialization and teardown

#### Type System (`types.ts`)
Comprehensive type definitions covering:
- Process states and metadata
- Capability interfaces
- Permission models
- Context representations
- AI request/response types
- UI state management
- Socket communication protocols

#### Permissions (`permissions.ts`)
Runtime permission enforcement:
- Granular access control (read/write/execute/delete/admin)
- Resource-scoped permissions (file/directory/network/process/system)
- Time-bound grants with expiration
- Permission caching for performance
- Decorator-based method protection

### Layer 2: Surface Adapters

**Location**: `server/adapters/`

Adapters translate between APOS kernel and external surfaces:

#### Terminal Adapter
- PTY (pseudo-terminal) integration via xterm.js
- Real-time output streaming
- Input command buffering
- Shell environment management

#### Browser Adapter
- Playwright/Puppeteer integration
- Page automation and control
- DOM inspection and manipulation
- Network request interception

#### File Adapter
- Workspace monitoring (chokidar)
- File operation queuing
- Change detection and diffing
- Git integration

#### Cloud Adapter
- Multi-provider abstraction (AWS/GCP/Azure)
- Resource provisioning
- Deployment automation
- Cost monitoring

### Layer 3: AI Integration

**Location**: `server/ai/`

#### Planning Engine
- Intent understanding
- Multi-step task decomposition
- Context gathering
- Execution strategy generation

#### Execution Monitor
- Real-time output analysis
- Error detection and classification
- Auto-fix generation
- Human intervention triggers

#### Learning System
- Workflow pattern recognition
- Success/failure tracking
- Optimization suggestions
- Preference learning

### Layer 4: UI Layer

**Location**: `src/`

#### Framework: SvelteKit
Chosen for:
- Reactive state management
- Minimal runtime overhead
- SSR + client hydration
- File-based routing

#### Design System
- Tailwind CSS for utility-first styling
- shadcn-svelte for premium components
- Framer Motion for animations
- GSAP for advanced choreography
- Three.js for 3D visualizations

#### Key Interfaces

**Terminal View**
- Split panes with xterm.js
- Command suggestion overlay
- Error highlighting with fix suggestions
- Process status indicators

**Browser View**
- Embedded browser preview
- DOM inspector
- Network monitor
- Automation recording

**Context Panel**
- Current workspace state
- Active processes
- Recent history
- AI suggestions

**Capability Dashboard**
- Installed capabilities
- Permission grants
- Resource usage
- Configuration

## Data Flow

### User Intent → Execution

```
1. User Input (Terminal/UI)
   ↓
2. AI Planning Engine
   - Parse intent
   - Gather context
   - Generate execution plan
   ↓
3. Kernel Process Spawning
   - Check permissions
   - Allocate resources
   - Initialize capabilities
   ↓
4. Surface Adapters
   - Execute on target surface
   - Stream output
   - Handle state changes
   ↓
5. Execution Monitor
   - Analyze output
   - Detect errors
   - Generate fixes
   ↓
6. User Feedback
   - Display results
   - Show suggestions
   - Request confirmation if needed
```

### Real-time Communication

**Socket.io Protocol**:
```typescript
// Client → Server
'process:start' → { command, cwd, env }
'ai:request' → { type, prompt, context }
'capability:register' → { id, config }

// Server → Client  
'process:output' → { processId, data }
'process:error' → { processId, error }
'ai:response' → { requestId, content }
'capability:status' → { id, status }
```

## State Management

### Server State
- **Kernel State**: In-memory process map + disk persistence
- **Capability Registry**: Plugin-based dynamic registration
- **Permission Store**: Cached with TTL + audit log
- **Context**: Session-scoped with workspace binding

### Client State
- **UI State**: Svelte stores (writable/readable/derived)
- **Terminal State**: xterm.js instances per pane
- **WebSocket State**: Socket.io connection manager
- **Cache**: IndexedDB for offline capability

## Security Model

### Principle of Least Privilege
- Default deny for all operations
- Explicit permission grants required
- Time-bound and resource-scoped
- Audit logging for sensitive operations

### Sandboxing
- Process isolation via OS-level sandboxing
- Network policies for outbound requests
- Filesystem access limited to workspace
- Capability-based security model

### AI Safety
- Human confirmation for destructive operations
- Dry-run mode for validation
- Rollback capability for file operations
- Confidence thresholds for auto-execution

## Extension Model

### Capability Plugins

Any capability can be added via plugin:

```typescript
export class MyCapability implements Capability {
  id = 'my-capability'
  category = 'custom'
  
  async initialize(config: any): Promise<void> {
    // Setup
  }
  
  async execute(context: ExecutionContext): Promise<Result> {
    // Implementation
  }
  
  getPermissions(): Permission[] {
    return [/* required permissions */]
  }
}
```

### UI Extensions

Custom views via Svelte components:

```svelte
<script lang="ts">
  import { capability } from '$lib/stores'
  // Extension logic
</script>

<!-- Custom UI -->
```

## Deployment

### Development
```bash
npm run dev        # Start dev server
npm run dev:server # Server only
npm run dev:client # Client only
```

### Production
```bash
npm run build      # Build for production
npm run start      # Start production server
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000 3001
CMD ["npm", "start"]
```

## Roadmap

### Phase 1: Foundation (Current)
- ✅ Kernel implementation
- ✅ Type system
- ✅ Permission management
- ✅ Capability framework
- 🔄 Terminal adapter
- 🔄 Basic UI

### Phase 2: AI Integration
- Planning engine
- Execution monitor
- Auto-fix generation
- Learning system

### Phase 3: Multi-Surface
- Browser automation
- Cloud integration
- Mobile companion
- Voice interface

### Phase 4: Ecosystem
- Plugin marketplace
- Workflow sharing
- Team collaboration
- Enterprise features

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT
