// Shared Type Definitions for APOS
// Complete type system for Autonomous Personal Operating System

// ============= KERNEL TYPES =============

export interface KernelConfig {
  maxConcurrentProcesses: number;
  memoryLimit: string;
  cpuLimit: number;
  sandboxEnabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  persistenceEnabled: boolean;
}

export interface Process {
  id: string;
  type: ProcessType;
  status: ProcessStatus;
  command: string;
  cwd: string;
  env: Record<string, string>;
  priority: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  pty?: any;
  output: string[];
  errorOutput: string[];
  exitCode?: number;
  metadata: ProcessMetadata;
}

export type ProcessType = 
  | 'shell'
  | 'build'
  | 'test'
  | 'deploy'
  | 'analysis'
  | 'background'
  | 'system';

export type ProcessStatus =
  | 'queued'
  | 'starting'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'killed';

export interface ProcessMetadata {
  name?: string;
  description?: string;
  tags: string[];
  parentId?: string;
  childIds: string[];
  contextId?: string;
}

export interface KernelState {
  processes: Map<string, Process>;
  activeProcesses: Set<string>;
  queuedProcesses: string[];
  completedProcesses: string[];
  failedProcesses: string[];
  systemResources: ResourceMetrics;
}

export interface ResourceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  processCount: number;
  uptime: number;
}

// ============= CAPABILITY TYPES =============

export interface Capability {
  id: string;
  name: string;
  category: CapabilityCategory;
  status: CapabilityStatus;
  priority: number;
  dependencies: string[];
  config: any;
  metadata: CapabilityMetadata;
}

export type CapabilityCategory =
  | 'filesystem'
  | 'network'
  | 'process'
  | 'git'
  | 'docker'
  | 'cloud'
  | 'database'
  | 'ai'
  | 'browser'
  | 'system';

export type CapabilityStatus =
  | 'available'
  | 'initializing'
  | 'active'
  | 'disabled'
  | 'error';

export interface CapabilityMetadata {
  description: string;
  version: string;
  provider: string;
  permissions: Permission[];
  resources: ResourceRequirements;
}

export interface ResourceRequirements {
  cpu?: number;
  memory?: string;
  disk?: string;
  network?: boolean;
}

// ============= PERMISSION TYPES =============

export interface Permission {
  id: string;
  type: PermissionType;
  scope: PermissionScope;
  resource: string;
  actions: PermissionAction[];
  granted: boolean;
  grantedAt?: number;
  grantedBy?: string;
  expiresAt?: number;
}

export type PermissionType =
  | 'read'
  | 'write'
  | 'execute'
  | 'delete'
  | 'admin';

export type PermissionScope =
  | 'file'
  | 'directory'
  | 'network'
  | 'process'
  | 'system'
  | 'global';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'execute'
  | 'share';

// ============= CONTEXT TYPES =============

export interface ExecutionContext {
  id: string;
  userId: string;
  sessionId: string;
  workspace: WorkspaceContext;
  environment: EnvironmentContext;
  state: ContextState;
  history: ContextEvent[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceContext {
  path: string;
  type: 'project' | 'playground' | 'temporary';
  git?: GitContext;
  packages: PackageContext[];
  config: Record<string, any>;
}

export interface GitContext {
  remote: string;
  branch: string;
  commit: string;
  status: GitStatus;
  uncommittedChanges: number;
}

export interface GitStatus {
  ahead: number;
  behind: number;
  staged: string[];
  unstaged: string[];
  untracked: string[];
}

export interface PackageContext {
  name: string;
  version: string;
  manager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  dependencies: Record<string, string>;
}

export interface EnvironmentContext {
  os: string;
  arch: string;
  node: string;
  shell: string;
  env: Record<string, string>;
  paths: string[];
}

export interface ContextState {
  currentDirectory: string;
  openFiles: string[];
  runningProcesses: string[];
  variables: Record<string, any>;
}

export interface ContextEvent {
  id: string;
  type: ContextEventType;
  timestamp: number;
  data: any;
}

export type ContextEventType =
  | 'process_start'
  | 'process_complete'
  | 'file_change'
  | 'directory_change'
  | 'variable_set'
  | 'error';

// ============= AI TYPES =============

export interface AIConfig {
  provider: 'google' | 'openai' | 'anthropic' | 'local';
  model: string;
  apiKey?: string;
  temperature: number;
  maxTokens: number;
  streaming: boolean;
}

export interface AIRequest {
  id: string;
  type: AIRequestType;
  prompt: string;
  context: ExecutionContext;
  config: AIConfig;
  timestamp: number;
}

export type AIRequestType =
  | 'command'
  | 'analysis'
  | 'suggestion'
  | 'explanation'
  | 'completion';

export interface AIResponse {
  id: string;
  requestId: string;
  content: string;
  type: AIResponseType;
  confidence: number;
  metadata: AIMetadata;
  timestamp: number;
}

export type AIResponseType =
  | 'text'
  | 'code'
  | 'command'
  | 'error'
  | 'suggestion';

export interface AIMetadata {
  model: string;
  tokensUsed: number;
  latency: number;
  cached: boolean;
}

// ============= UI TYPES =============

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  layout: LayoutConfig;
  panels: PanelState[];
  activePanel?: string;
  notifications: Notification[];
}

export interface LayoutConfig {
  mode: 'split' | 'tabs' | 'grid';
  sizes: number[];
  orientation: 'horizontal' | 'vertical';
}

export interface PanelState {
  id: string;
  type: PanelType;
  title: string;
  active: boolean;
  minimized: boolean;
  size: number;
  content: any;
}

export type PanelType =
  | 'terminal'
  | 'editor'
  | 'browser'
  | 'output'
  | 'files'
  | 'search';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: NotificationAction[];
}

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface NotificationAction {
  label: string;
  action: () => void;
}

// ============= SOCKET TYPES =============

export interface SocketMessage {
  type: SocketMessageType;
  payload: any;
  timestamp: number;
}

export type SocketMessageType =
  | 'process:start'
  | 'process:output'
  | 'process:error'
  | 'process:complete'
  | 'capability:register'
  | 'capability:status'
  | 'context:update'
  | 'ai:request'
  | 'ai:response'
  | 'ui:update';

// ============= EVENT TYPES =============

export interface SystemEvent {
  id: string;
  type: SystemEventType;
  severity: EventSeverity;
  source: string;
  message: string;
  data: any;
  timestamp: number;
}

export type SystemEventType =
  | 'startup'
  | 'shutdown'
  | 'error'
  | 'warning'
  | 'info'
  | 'capability_loaded'
  | 'process_spawn'
  | 'resource_limit';

export type EventSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

// ============= ERROR TYPES =============

export class KernelError extends Error {
  code: string;
  severity: EventSeverity;
  recoverable: boolean;
  context?: any;

  constructor(message: string, code: string, severity: EventSeverity = 'medium', recoverable = true) {
    super(message);
    this.name = 'KernelError';
    this.code = code;
    this.severity = severity;
    this.recoverable = recoverable;
  }
}

export class CapabilityError extends Error {
  capability: string;
  reason: string;

  constructor(capability: string, reason: string) {
    super(`Capability '${capability}' error: ${reason}`);
    this.name = 'CapabilityError';
    this.capability = capability;
    this.reason = reason;
  }
}

export class PermissionError extends Error {
  permission: string;
  required: PermissionAction[];

  constructor(permission: string, required: PermissionAction[]) {
    super(`Permission '${permission}' denied. Required: ${required.join(', ')}`);
    this.name = 'PermissionError';
    this.permission = permission;
    this.required = required;
  }
}

// ============= UTILITY TYPES =============

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Awaitable<T> = T | Promise<T>;

export type ValueOf<T> = T[keyof T];

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
