/**
 * Kernel Core - Multi-Surface Autonomous Operating Environment
 * 
 * The kernel is domain-agnostic and coordinates execution across
 * multiple surfaces (terminal, canvas, browser, chat) with unified
 * state, verification, and permission enforcement.
 */

import { nanoid } from 'nanoid';
import { Memory } from './memory';
import { SURFACE_PERMISSIONS } from './permissions';
import type { 
  KernelState, 
  SurfaceEvent, 
  Tool, 
  Criteria, 
  Surface 
} from '../../shared/types';

export class Kernel {
  private state: KernelState;
  private memory: Memory;
  private tools: Map<string, Tool>;
  private eventQueue: SurfaceEvent[] = [];
  private loopActive = false;

  constructor() {
    this.state = this.initializeState();
    this.memory = new Memory();
    this.tools = new Map();
  }

  /**
   * Main execution loop - never exits until criteria satisfied
   */
  async startLoop(criteria: Criteria[]) {
    this.state.criteria = criteria;
    this.loopActive = true;

    while (!this.criteriaSatisfied() && this.loopActive) {
      // PLAN
      const plan = await this.plan();

      // ACT (tools only - no suggestions)
      if (!plan.toolCalls || plan.toolCalls.length === 0) {
        throw new Error('Agent must call tools, not just reason');
      }

      await this.act(plan.toolCalls);

      // OBSERVE
      await this.observe();

      // VERIFY
      const verification = this.verify();

      // REFINE if needed
      if (!verification.allSatisfied) {
        await this.refine(verification.unsatisfied);
      }

      // Broadcast state update to all surfaces
      this.broadcastStateUpdate();
    }

    return this.state;
  }

  /**
   * Handle events from surfaces (terminal, canvas, browser, chat)
   */
  async handleSurfaceEvent(event: SurfaceEvent): Promise<any> {
    const permission = this.getPermission(event.surface);

    // Permission check: Can this surface initiate work?
    if (event.type === 'initiate' && !permission.canInitiate) {
      throw new Error(
        `Surface ${event.surface} cannot initiate work. ` +
        `Use an initiator surface (terminal, canvas, chat).`
      );
    }

    // Permission check: Can this surface execute tools?
    if (event.type === 'execute_tool' && !permission.canExecuteTools) {
      throw new Error(
        `Surface ${event.surface} cannot execute tools directly.`
      );
    }

    // Risk check: Does this action require confirmation?
    if (permission.requiresConfirmation && this.isRiskyAction(event)) {
      await this.awaitUserConfirmation(event);
    }

    // Execute the event
    const result = await this.execute(event);

    // Update state if this surface can modify it
    if (permission.canModifyState) {
      this.updateState(event, result);
    }

    // Propagate state to all surfaces
    this.broadcastStateUpdate();

    return result;
  }

  /**
   * Register a tool in the kernel's tool registry
   */
  registerTool(name: string, tool: Tool) {
    this.tools.set(name, tool);
  }

  /**
   * Check if action is risky and requires confirmation
   */
  private isRiskyAction(event: SurfaceEvent): boolean {
    const riskyTools = [
      'browser_click',
      'browser_type',
      'email_send',
      'slack_send',
      'deploy',
      'git_push'
    ];

    return (
      riskyTools.some(tool => event.tool?.startsWith(tool)) ||
      event.workflow?.actions.some(a => riskyTools.includes(a.tool))
    );
  }

  /**
   * Get permission settings for a surface
   */
  private getPermission(surface: Surface) {
    return SURFACE_PERMISSIONS.find(p => p.surface === surface)!;
  }

  /**
   * Verify if all criteria are satisfied
   */
  private criteriaSatisfied(): boolean {
    return this.state.criteria.every(c => this.verifyCriterion(c));
  }

  /**
   * Verify a single criterion
   */
  private verifyCriterion(criterion: Criteria): boolean {
    switch (criterion.type) {
      case 'lint':
        return this.state.lintStatus?.status === 'clean';
      case 'tests':
        return this.state.testStatus?.status === 'passing';
      case 'file_exists':
        return this.state.fileSystem?.exists(criterion.path!);
      case 'grep':
        return this.state.grepResults?.[criterion.pattern!] === criterion.count;
      default:
        return false;
    }
  }

  /**
   * Initialize default kernel state
   */
  private initializeState(): KernelState {
    return {
      id: nanoid(),
      repoRoot: process.cwd(),
      lastCommands: [],
      fileDiffs: [],
      lintStatus: null,
      testStatus: null,
      browserState: null,
      criteria: [],
      loopActive: false
    };
  }

  private async plan() {
    // TODO: Implement Gemini API planning
    throw new Error('Not implemented');
  }

  private async act(toolCalls: any[]) {
    // TODO: Execute tool calls
    throw new Error('Not implemented');
  }

  private async observe() {
    // TODO: Observe state changes
    throw new Error('Not implemented');
  }

  private verify() {
    // TODO: Verify criteria
    return { allSatisfied: false, unsatisfied: [] };
  }

  private async refine(unsatisfied: any[]) {
    // TODO: Refine plan based on unsatisfied criteria
  }

  private async execute(event: SurfaceEvent) {
    // TODO: Execute surface event
    return {};
  }

  private updateState(event: SurfaceEvent, result: any) {
    // TODO: Update kernel state
  }

  private broadcastStateUpdate() {
    // TODO: Emit state to all surfaces via Socket.IO
  }

  private async awaitUserConfirmation(event: SurfaceEvent) {
    // TODO: Pause and wait for user confirmation
  }

  halt() {
    this.loopActive = false;
  }
}
