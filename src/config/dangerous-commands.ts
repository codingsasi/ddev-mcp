/**
 * Dangerous Commands Configuration
 *
 * This file defines which tools and commands are considered dangerous.
 * Contributors can easily add new dangerous patterns here.
 *
 * NOTE: After tool reduction (v1.0.2+), most commands go through ddev_exec.
 * Specialized tools (ddev_drush, ddev_composer, ddev_wp_cli, etc.) have been removed.
 */

export interface DangerousCommandConfig {
  toolName: string;
  description: string;
  dangerousPatterns: RegExp[];
  commandParam?: string; // Parameter name that contains the command (e.g., 'command', 'query', 'action')
}

export const DANGEROUS_COMMANDS: DangerousCommandConfig[] = [
  {
    toolName: 'ddev_exec',
    description: 'Commands that can affect production environments or cause data loss',
    commandParam: 'command',
    dangerousPatterns: [
      // ===== Platform.sh Commands =====
      // Environment operations
      /platform\s+environment:(delete|deploy|redeploy|merge|push|synchronize|activate)/i,
      /platform\s+-e\s*(prod|production|master|main)/i,
      /-e\s*(prod|production|master|main)\s+platform/i,

      // Backup operations
      /platform\s+backup:(create|delete|restore)/i,

      // Database operations
      /platform\s+db:(dump|sql)/i,

      // Domain and certificate operations
      /platform\s+domain:(add|delete|update)/i,
      /platform\s+certificate:(add|delete)/i,

      // Project operations
      /platform\s+project:(delete|create)/i,

      // User management
      /platform\s+user:(add|delete|update)/i,

      // Variable operations
      /platform\s+variable:(create|delete|update)/i,

      // Integration operations
      /platform\s+integration:(add|delete|update)/i,

      // Organization operations
      /platform\s+organization:(create|delete|billing)/i,

      // Team operations
      /platform\s+team:(create|delete|update|project:add|project:delete|user:add|user:delete)/i,

      // Service operations
      /platform\s+service:mongo:(dump|restore)/i,

      // Mount operations
      /platform\s+mount:(download|upload)/i,

      // Operation execution
      /platform\s+(operation:run|source-operation:run)/i,

      // ===== Drupal/Drush Commands =====
      // Production environment Drush commands
      /drush\s+.*-e\s*(prod|production|master|main)/i,
      /drush\s+.*@(prod|production|master|main)/i,
      /@(prod|production|master|main)\s+drush/i,

      // Destructive Drush commands (any environment)
      /drush\s+(sql-drop|site-install|pm:uninstall|config:delete|entity:delete)/i,
      /drush\s+sqlc\s+.*DROP/i,

      // ===== WordPress/WP-CLI Commands =====
      // Production environment WP commands
      /wp\s+.*--url=.*(prod|production|master|main)/i,

      // ===== Git Operations =====
      // Force push to protected branches
      /git\s+push\s+(origin\s+)?(prod|production|master|main)/i,
      /git\s+push\s+.*(-f|--force)/i,

      // Destructive Git operations
      /git\s+reset\s+--hard/i,
      /git\s+clean\s+-fd/i,

      // ===== General Patterns =====
      // Words that often indicate dangerous operations
      /(redeploy|destroy|wipe|nuke)\s/i,
    ]
  },

  // ===== Example: Adding protection to other tools =====
  // Uncomment and modify if you add new tools that need protection

  // Example 1: Protect a future database tool
  // {
  //   toolName: 'ddev_database',
  //   description: 'Direct database operations that can cause data loss',
  //   commandParam: 'query',
  //   dangerousPatterns: [
  //     /DROP\s+(DATABASE|TABLE)/i,
  //     /TRUNCATE\s+TABLE/i,
  //     /DELETE\s+FROM\s+\w+(?!\s+WHERE)/i,
  //     /ALTER\s+TABLE.*DROP/i,
  //     /UPDATE\s+\w+\s+SET(?!\s+WHERE)/i, // UPDATE without WHERE
  //   ]
  // },

  // Example 2: Protect a hypothetical deployment tool
  // {
  //   toolName: 'ddev_deploy',
  //   description: 'Deployment operations that affect production',
  //   commandParam: 'environment',
  //   dangerousPatterns: [
  //     /(prod|production|master|main)/i,
  //   ]
  // },

  // Example 3: Make an entire tool require dangerous flag
  // {
  //   toolName: 'ddev_nuclear_option',
  //   description: 'Extremely destructive operations',
  //   commandParam: 'command',
  //   dangerousPatterns: [/.*/] // ALL commands from this tool are dangerous
  // },
];

/**
 * Notes for Contributors:
 *
 * 1. After v1.0.2 tool reduction, we only have 13 tools total:
 *    - Core: ddev_start, ddev_stop, ddev_restart, ddev_describe, ddev_list, ddev_logs
 *    - Database: ddev_import_db, ddev_export_db, ddev_snapshot
 *    - Universal: ddev_exec (handles all CMS/framework commands)
 *    - Utilities: ddev_version, ddev_poweroff, message_complete_notification
 *
 * 2. Most dangerous commands will come through ddev_exec since it's the executor
 *
 * 3. When adding patterns, consider:
 *    - Is it destructive? (deletes, drops, truncates)
 *    - Does it affect production? (prod, master, main branches/environments)
 *    - Is it irreversible? (no easy undo)
 *    - Could it cause downtime? (deploys, restarts)
 *
 * 4. Pattern syntax tips:
 *    - Use \s+ for whitespace (handles spaces and tabs)
 *    - Use (option1|option2) for alternatives
 *    - Use /i flag for case-insensitive matching
 *    - Use \b for word boundaries
 *    - Escape special regex chars: . * + ? ^ $ { } ( ) | [ ] \
 *
 * 5. Test your patterns before committing:
 *    const pattern = /your-pattern/i;
 *    console.log(pattern.test('test command'));
 */

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
