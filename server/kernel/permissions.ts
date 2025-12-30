// Permission Management System for APOS
// Runtime permission checking and enforcement

import {
  Permission,
  PermissionType,
  PermissionScope,
  PermissionAction,
  PermissionError
} from './types';

export class PermissionManager {
  private permissions: Map<string, Permission> = new Map();
  private cache: Map<string, boolean> = new Map();
  private readonly cacheTimeout = 5000; // 5 seconds

  constructor() {
    this.initializeDefaultPermissions();
  }

  // Initialize default permissions for APOS
  private initializeDefaultPermissions(): void {
    const defaults: Partial<Permission>[] = [
      {
        id: 'fs:read:workspace',
        type: 'read',
        scope: 'directory',
        resource: 'workspace',
        actions: ['view'],
        granted: true
      },
      {
        id: 'fs:write:workspace',
        type: 'write',
        scope: 'directory',
        resource: 'workspace',
        actions: ['create', 'update'],
        granted: true
      },
      {
        id: 'process:execute',
        type: 'execute',
        scope: 'process',
        resource: '*',
        actions: ['execute'],
        granted: true
      },
      {
        id: 'network:access',
        type: 'read',
        scope: 'network',
        resource: '*',
        actions: ['view'],
        granted: false // Requires explicit grant
      }
    ];

    defaults.forEach(perm => {
      if (perm.id) {
        this.permissions.set(perm.id, perm as Permission);
      }
    });
  }

  // Grant a permission
  grant(permissionId: string, grantedBy?: string): void {
    const permission = this.permissions.get(permissionId);
    if (!permission) {
      throw new PermissionError(permissionId, ['Permission not found']);
    }

    permission.granted = true;
    permission.grantedAt = Date.now();
    permission.grantedBy = grantedBy;

    // Invalidate cache
    this.clearCacheForPermission(permissionId);
  }

  // Revoke a permission
  revoke(permissionId: string): void {
    const permission = this.permissions.get(permissionId);
    if (!permission) {
      throw new PermissionError(permissionId, ['Permission not found']);
    }

    permission.granted = false;
    permission.grantedAt = undefined;
    permission.grantedBy = undefined;

    this.clearCacheForPermission(permissionId);
  }

  // Check if a permission is granted
  check(
    type: PermissionType,
    scope: PermissionScope,
    resource: string,
    action: PermissionAction
  ): boolean {
    const cacheKey = this.getCacheKey(type, scope, resource, action);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Find matching permission
    const permission = this.findPermission(type, scope, resource);
    if (!permission) {
      this.cache.set(cacheKey, false);
      return false;
    }

    // Check if granted and action is allowed
    const granted = permission.granted && permission.actions.includes(action);
    
    // Check expiration
    if (granted && permission.expiresAt) {
      const expired = Date.now() > permission.expiresAt;
      if (expired) {
        this.cache.set(cacheKey, false);
        return false;
      }
    }

    this.cache.set(cacheKey, granted);
    return granted;
  }

  // Require a permission (throws if not granted)
  require(
    type: PermissionType,
    scope: PermissionScope,
    resource: string,
    action: PermissionAction
  ): void {
    if (!this.check(type, scope, resource, action)) {
      throw new PermissionError(
        `${type}:${scope}:${resource}`,
        [action]
      );
    }
  }

  // Register a new permission
  register(permission: Permission): void {
    if (this.permissions.has(permission.id)) {
      throw new Error(`Permission ${permission.id} already exists`);
    }
    this.permissions.set(permission.id, permission);
  }

  // Find a permission by criteria
  private findPermission(
    type: PermissionType,
    scope: PermissionScope,
    resource: string
  ): Permission | undefined {
    // Try exact match first
    const exactId = `${type}:${scope}:${resource}`;
    if (this.permissions.has(exactId)) {
      return this.permissions.get(exactId);
    }

    // Try wildcard match
    const wildcardId = `${type}:${scope}:*`;
    if (this.permissions.has(wildcardId)) {
      return this.permissions.get(wildcardId);
    }

    // Search through all permissions
    for (const perm of this.permissions.values()) {
      if (
        perm.type === type &&
        perm.scope === scope &&
        (perm.resource === resource || perm.resource === '*')
      ) {
        return perm;
      }
    }

    return undefined;
  }

  // Get cache key for permission check
  private getCacheKey(
    type: PermissionType,
    scope: PermissionScope,
    resource: string,
    action: PermissionAction
  ): string {
    return `${type}:${scope}:${resource}:${action}`;
  }

  // Clear cache for a specific permission
  private clearCacheForPermission(permissionId: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(permissionId)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Clear all cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get all permissions
  getAll(): Permission[] {
    return Array.from(this.permissions.values());
  }

  // Get permissions by scope
  getByScope(scope: PermissionScope): Permission[] {
    return this.getAll().filter(p => p.scope === scope);
  }

  // Get granted permissions
  getGranted(): Permission[] {
    return this.getAll().filter(p => p.granted);
  }

  // Export permissions for serialization
  export(): Record<string, Permission> {
    const exported: Record<string, Permission> = {};
    this.permissions.forEach((value, key) => {
      exported[key] = value;
    });
    return exported;
  }

  // Import permissions from serialized data
  import(data: Record<string, Permission>): void {
    Object.entries(data).forEach(([key, value]) => {
      this.permissions.set(key, value);
    });
    this.clearCache();
  }
}

// Singleton instance
export const permissionManager = new PermissionManager();

// Helper functions for common permission checks
export const canRead = (scope: PermissionScope, resource: string): boolean => {
  return permissionManager.check('read', scope, resource, 'view');
};

export const canWrite = (scope: PermissionScope, resource: string): boolean => {
  return permissionManager.check('write', scope, resource, 'update');
};

export const canExecute = (scope: PermissionScope, resource: string): boolean => {
  return permissionManager.check('execute', scope, resource, 'execute');
};

export const canDelete = (scope: PermissionScope, resource: string): boolean => {
  return permissionManager.check('delete', scope, resource, 'delete');
};

// Decorator for permission-protected methods
export function RequirePermission(
  type: PermissionType,
  scope: PermissionScope,
  resource: string,
  action: PermissionAction
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      permissionManager.require(type, scope, resource, action);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
