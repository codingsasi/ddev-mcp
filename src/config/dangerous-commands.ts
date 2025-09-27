/**
 * Dangerous Commands Configuration
 *
 * This file defines which tools and commands are considered dangerous.
 * Contributors can easily add new dangerous patterns here.
 */

export interface DangerousCommandConfig {
  toolName: string;
  description: string;
  dangerousPatterns: RegExp[];
  commandParam?: string; // Parameter name that contains the command (e.g., 'command', 'query', 'action')
}

export const DANGEROUS_COMMANDS: DangerousCommandConfig[] = [
  {
    toolName: 'ddev_platform',
    description: 'Platform.sh CLI commands that can affect production environments',
    commandParam: 'command',
    dangerousPatterns: [
      // Environment operations that can affect production
      /environment:delete/i,
      /environment:deploy/i,
      /environment:redeploy/i,
      /environment:merge/i,
      /environment:pause/i,
      /environment:push/i,
      /environment:resume/i,
      /environment:synchronize/i,
      /environment:activate/i,
      /environment:branch/i,
      /environment:checkout/i,

      // Backup operations
      /backup:create/i,
      /backup:delete/i,
      /backup:restore/i,

      // Database operations
      /db:dump/i,
      /db:sql/i,

      // Domain operations
      /domain:add/i,
      /domain:delete/i,
      /domain:update/i,

      // Certificate operations
      /certificate:add/i,
      /certificate:delete/i,

      // Project operations
      /project:delete/i,
      /project:create/i,

      // User management
      /user:add/i,
      /user:delete/i,
      /user:update/i,

      // Variable operations
      /variable:create/i,
      /variable:delete/i,
      /variable:update/i,

      // Integration operations
      /integration:add/i,
      /integration:delete/i,
      /integration:update/i,

      // Organization operations
      /organization:create/i,
      /organization:delete/i,
      /organization:billing:address/i,
      /organization:billing:profile/i,

      // Team operations
      /team:create/i,
      /team:delete/i,
      /team:update/i,
      /team:project:add/i,
      /team:project:delete/i,
      /team:user:add/i,
      /team:user:delete/i,

      // Service operations
      /service:mongo:dump/i,
      /service:mongo:restore/i,

      // SSH operations to production environments
      /ssh.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*ssh/i,
      /scp.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*scp/i,

      // Drush operations on production environments
      /drush.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*drush/i,
      /environment:drush.*-e(prod|production|master|main)/i,

      // Mount operations
      /mount:download/i,
      /mount:upload/i,

      // Operation execution
      /operation:run/i,

      // Source operations
      /source-operation:run/i,

      // General dangerous patterns
      /redeploy/i,
      /delete/i,
      /remove/i,
      /destroy/i,
      /wipe/i,
      /clear.*cache/i,
      /project:clear-build-cache/i
    ]
  },

  {
    toolName: 'ddev_exec',
    description: 'Execute arbitrary commands in DDEV containers (can be dangerous)',
    commandParam: 'command',
    dangerousPatterns: [
      // Platform.sh production environment commands
      /platform.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*platform/i,
      /platform.*environment:redeploy/i,
      /platform.*environment:delete/i,
      /platform.*environment:deploy/i,
      /platform.*environment:merge/i,
      /platform.*environment:push/i,
      /platform.*environment:synchronize/i,
      /platform.*environment:activate/i,
      /platform.*environment:branch/i,
      /platform.*environment:checkout/i,
      /platform.*backup:create/i,
      /platform.*backup:delete/i,
      /platform.*backup:restore/i,
      /platform.*db:dump/i,
      /platform.*db:sql/i,
      /platform.*domain:add/i,
      /platform.*domain:delete/i,
      /platform.*domain:update/i,
      /platform.*certificate:add/i,
      /platform.*certificate:delete/i,
      /platform.*project:delete/i,
      /platform.*project:create/i,
      /platform.*user:add/i,
      /platform.*user:delete/i,
      /platform.*user:update/i,
      /platform.*variable:create/i,
      /platform.*variable:delete/i,
      /platform.*variable:update/i,
      /platform.*integration:add/i,
      /platform.*integration:delete/i,
      /platform.*integration:update/i,
      /platform.*organization:create/i,
      /platform.*organization:delete/i,
      /platform.*team:create/i,
      /platform.*team:delete/i,
      /platform.*team:update/i,
      /platform.*service:mongo:dump/i,
      /platform.*service:mongo:restore/i,
      /platform.*mount:download/i,
      /platform.*mount:upload/i,
      /platform.*operation:run/i,
      /platform.*source-operation:run/i,

      // Drush production environment commands
      /drush.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*drush/i,
      /drush.*@prod/i,
      /drush.*@production/i,
      /drush.*@master/i,
      /drush.*@main/i,
      /@prod.*drush/i,
      /@production.*drush/i,
      /@master.*drush/i,
      /@main.*drush/i,

      // WP-CLI production environment commands
      /wp.*--url=.*prod/i,
      /wp.*--url=.*production/i,
      /wp.*--url=.*master/i,
      /wp.*--url=.*main/i,

      // Git operations that can affect production
      /git\s+push\s+origin\s+(prod|production|master|main)/i,
      /git\s+push\s+(prod|production|master|main)/i,
      /git\s+push.*-f/i,
      /git\s+push.*--force/i,

      // SSH/SCP to production environments
      /ssh.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*ssh/i,
      /scp.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*scp/i,
      /ssh.*@prod/i,
      /ssh.*@production/i,
      /ssh.*@master/i,
      /ssh.*@main/i,
      /@prod.*ssh/i,
      /@production.*ssh/i,
      /@master.*ssh/i,
      /@main.*ssh/i,

      // Database operations on production
      /mysql.*-h.*prod/i,
      /mysql.*-h.*production/i,
      /mysqldump.*-h.*prod/i,
      /mysqldump.*-h.*production/i,

    ]
  },

  // Example: Future tool that might have dangerous commands
  // {
  //   toolName: 'ddev_database',
  //   description: 'Database operations that can affect data',
  //   commandParam: 'action',
  //   dangerousPatterns: [
  //     /drop/i,
  //     /truncate/i,
  //     /delete.*from/i,
  //     /alter.*table/i
  //   ]
  // },

  // Example: Tool where the entire tool is dangerous
  // {
  //   toolName: 'ddev_destroy_project',
  //   description: 'Completely destroys a DDEV project and all its data',
  //   dangerousPatterns: [/.*/] // All commands are dangerous
  // }
];

/**
 * Check if a tool has dangerous command patterns
 */
export function getDangerousConfig(toolName: string): DangerousCommandConfig | undefined {
  return DANGEROUS_COMMANDS.find(config => config.toolName === toolName);
}

/**
 * Check if a specific command is dangerous for a given tool
 */
export function isCommandDangerous(toolName: string, command: string): boolean {
  const config = getDangerousConfig(toolName);
  if (!config) {
    return false;
  }

  return config.dangerousPatterns.some(pattern => pattern.test(command));
}

/**
 * Get all dangerous tools
 */
export function getDangerousTools(): string[] {
  return DANGEROUS_COMMANDS.map(config => config.toolName);
}
