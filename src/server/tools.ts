/**
 * MCP Tool Definitions for DDEV Server
 * Following Playwright MCP patterns for tool registration and handling
 */

import { ToolDefinition } from '../types/index.js';

export const DDEV_TOOLS: ToolDefinition[] = [
  {
    name: 'ddev_start',
    description: `Start a DDEV project environment. Initializes and configures the web server and database containers. Run from project directory or pass project name(s).
Usage: ddev start [projectname ...] [flags]
Flags: -a/--all, -y/--skip-confirmation, --skip-hooks
For full options: ddev help start`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        skipHooks: {
          type: 'boolean',
          description: 'Skip running start hooks',
          default: false
        },
        skipConfirmation: {
          type: 'boolean',
          description: 'Skip confirmation prompts',
          default: false
        }
      },
      required: ['projectPath']
    }
  },

  {
    name: 'ddev_stop',
    description: `Stop and remove the containers of a DDEV project. Non-destructive: leaves database and code intact. Run from project dir or pass project name(s).
Usage: ddev stop [projectname ...] [flags]
For full options (e.g. --remove-data, --snapshot): ddev help stop`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        }
      },
      required: ['projectPath']
    }
  },

  {
    name: 'ddev_restart',
    description: `Restart a DDEV project: stops then starts named project(s).
Usage: ddev restart [projectname ...] [flags]
Flags: -a/--all, -y/--skip-confirmation
For full options: ddev help restart`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        }
      },
      required: ['projectPath']
    }
  },

  {
    name: 'ddev_describe',
    description: `Get a detailed description of a running DDEV project (name, location, URL, status, MySQL connection details, Mailpit, etc.). Aliases: describe, status, st.
Usage: ddev describe [projectname] [flags]
For full options: ddev help describe`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        }
      }
    }
  },

  {
    name: 'ddev_list',
    description: `List DDEV projects and their status. Shows all by default; use activeOnly for running only.
Usage: ddev list [flags]
Flags: -A/--active-only, -t/--type
For full options: ddev help list`,
    inputSchema: {
      type: 'object',
      properties: {
        activeOnly: {
          type: 'boolean',
          description: 'Show only running projects',
          default: false
        }
      }
    }
  },

  {
    name: 'ddev_import_db',
    description: `Import a SQL dump file into the project. Supports .sql, .sql.gz, .sql.bz2, .sql.xz, .mysql, .zip, .tgz, .tar.gz. For archives, use extractPath for path inside archive. Target DB via targetDb (default "db").
Usage: ddev import-db [project] [flags]
MCP args → ddev: src → --file, targetDb → --database, extractPath → --extract-path
For full options and examples: ddev help import-db`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        src: {
          type: 'string',
          description: 'Path to SQL dump file (ddev --file). Relative to project or absolute.'
        },
        extractPath: {
          type: 'string',
          description: 'Path to extract within archive (ddev --extract-path)'
        },
        targetDb: {
          type: 'string',
          description: 'Target database name (ddev --database, default "db")'
        }
      }
    }
  },

  {
    name: 'ddev_export_db',
    description: `Dump a database to a file or stdout. Compression: gzip (default), bzip2, or xz. Target DB via targetDb (default "db").
Usage: ddev export-db [project] [flags]
MCP args → ddev: file → -f/--file, targetDb → -d/--database, compressionType → --gzip|--bzip2|--xz
For full options and examples: ddev help export-db`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        file: {
          type: 'string',
          description: 'Output file path'
        },
        compressionType: {
          type: 'string',
          enum: ['gzip', 'bzip2', 'xz'],
          description: 'Compression type for export'
        },
        targetDb: {
          type: 'string',
          description: 'Target database name'
        }
      }
    }
  },

  {
    name: 'ddev_logs',
    description: `Display stdout logs from DDEV services (docker logs). Default: web service; use service for e.g. db.
Usage: ddev logs [projectname] [flags]
Flags: -s/--service (web|db), -f/--follow, --tail N
For full options: ddev help logs`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        service: {
          type: 'string',
          description: 'Specific service to get logs from'
        },
        follow: {
          type: 'boolean',
          description: 'Follow log output',
          default: false
        },
        tail: {
          type: 'number',
          description: 'Number of lines to tail'
        }
      }
    }
  },

  // Database snapshots
  {
    name: 'ddev_snapshot',
    description: `Create, list, restore, or cleanup database snapshots (stored in .ddev/db_snapshots). Restore with action=restore and snapshotName; use ddev snapshot restore --latest for latest.
Usage: ddev snapshot [projectname...] [flags] | ddev snapshot restore [name] [flags]
Actions: create (optional name), list, restore (snapshotName or --latest), cleanup. Flags: -n/--name, -l/--list, -C/--cleanup, -y/--yes, -a/--all
For full options: ddev help snapshot; ddev snapshot restore --help`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        action: {
          type: 'string',
          description: 'Action to perform: create, list, restore, cleanup',
          enum: ['create', 'list', 'restore', 'cleanup'],
          default: 'create'
        },
        name: {
          type: 'string',
          description: 'Name for the snapshot (for create action)'
        },
        snapshotName: {
          type: 'string',
          description: 'Name of snapshot to restore (for restore action)'
        },
        all: {
          type: 'boolean',
          description: 'Apply to all projects',
          default: false
        },
        yes: {
          type: 'boolean',
          description: 'Skip confirmation prompts',
          default: false
        }
      }
    }
  },


  // Service management - PRIMARY COMMAND EXECUTOR
  {
    name: 'ddev_exec',
    description: `Execute a shell command in the container for a DDEV service. Default: web service; use service (e.g. db, redis, solr) to run in another. workdir maps to ddev --dir.
Usage: ddev exec [flags] [command] [command-flags]
Flags: -s/--service (default web), -d/--dir (execution directory)
For full options: ddev help exec

COMMON USE CASES:

**Drupal (Drush):**
- "drush status" - Site status
- "drush cr" - Clear cache
- "drush uli" - Generate login link
- "drush cex" - Export config
- "drush cim" - Import config
- "drush pm:install module_name" - Install module
- "drush updb -y" - Run database updates

**WordPress (WP-CLI):**
- "wp cli version" - WP-CLI version
- "wp plugin list" - List plugins
- "wp plugin install akismet --activate" - Install & activate plugin
- "wp theme list" - List themes
- "wp user list" - List users
- "wp core update" - Update WordPress
- "wp cache flush" - Clear cache
- "wp search-replace old.com new.com" - Search/replace URLs

**Composer:**
- "composer install" - Install dependencies
- "composer update" - Update packages
- "composer require vendor/package" - Add package
- "composer show" - List installed packages

**Redis:**
- "redis-cli INFO" - Server info
- "redis-cli PING" - Test connection
- "redis-cli KEYS *" - List keys
- "redis-cli FLUSHALL" - Clear all caches

**Solr:**
- "curl http://solr:8983/solr/admin/cores?action=STATUS" - Check cores
- "curl http://solr:8983/solr/corename/select?q=*:*" - Query Solr

**MySQL/MariaDB:**
- "mysql -e 'SHOW DATABASES'" - List databases
- "mysql -e 'SHOW TABLES' db" - List tables
- "mysql -e 'SELECT VERSION()'" - Database version

**Platform.sh CLI:**
- "platform environment:list" - List environments
- "platform db:dump" - Export database

**Node.js/npm:**
- "npm install" - Install packages
- "npm run build" - Build assets
- "npm run test" - Run tests
- "node --version" - Node version

**Testing Frameworks:**
- "playwright test" - Run Playwright tests
- "cypress run" - Run Cypress tests
- "phpunit" - Run PHP unit tests

**Other:**
- "php -v" - PHP version
- "ls -la" - List files
- "cat config/sync/system.site.yml" - Read file
- "env" - Show environment variables

Dangerous commands blocked unless ALLOW_DANGEROUS_COMMANDS=true.`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Command to execute. Examples: "playwright test" (run Playwright tests), "npm run test:e2e" (run E2E tests), "npm run build" (build assets), "redis-cli ping" (test Redis), "curl http://solr:8983/solr/" (test Solr). For Drush commands, use ddev_drush. For Composer commands, use ddev_composer. Dangerous commands are blocked unless ALLOW_DANGEROUS_COMMANDS=true.'
        },
        service: {
          type: 'string',
          description: 'Service to execute in: web (default), db, redis, solr, or any other service. AUTO-ROUTING: npm/php commands → web, mysql/mariadb commands → db, redis-cli commands → redis, solr commands → solr'
        },
        workdir: {
          type: 'string',
          description: 'Working directory for the command (e.g., "/var/www/html", "/var/www/html/drupal")'
        }
      },
      required: ['projectPath', 'command']
    }
  },

  // Global operations
  {
    name: 'ddev_poweroff',
    description: `Stop all DDEV projects and containers (equivalent to ddev stop -a --stop-ssh-agent). Stops Mutagen daemon if running.
Usage: ddev poweroff [flags]
For full options: ddev help poweroff`,
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },

  {
    name: 'ddev_version',
    description: `Display the version of the DDEV binary and its components.
Usage: ddev version [flags]
For full options: ddev help version`,
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },

  {
    name: 'ddev_help',
    description: `Get help for any DDEV command. Returns the same output as "ddev help <command>" or "ddev <command> <subcommand> --help". Use when you need exact flags, examples, or usage for a ddev command.
Usage: ddev help [command] | ddev <command> <subcommand> --help
Examples: command="import-db" → ddev help import-db; command="snapshot", subcommand="restore" → ddev snapshot restore --help. Leave command empty for general ddev help.`,
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'DDEV command name (e.g. start, stop, import-db, export-db, logs, snapshot, exec, poweroff, version). Omit for general ddev help.'
        },
        subcommand: {
          type: 'string',
          description: 'Optional subcommand (e.g. restore for "ddev snapshot restore --help"). Use with command.'
        },
        projectPath: {
          type: 'string',
          description: 'Optional project path (cwd for running ddev). Not required for help.'
        }
      }
    }
  },

  // User Interaction Tools
  {
    name: 'message_complete_notification',
    description: 'Send a simple OS notification to the user',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Notification title'
        },
        message: {
          type: 'string',
          description: 'Notification message'
        }
      },
      required: ['title', 'message']
    }
  }
];

/**
 * Get tool definition by name
 */
export function getToolDefinition(name: string): ToolDefinition | undefined {
  return DDEV_TOOLS.find(tool => tool.name === name);
}

/**
 * Get all tool names
 */
export function getToolNames(): string[] {
  return DDEV_TOOLS.map(tool => tool.name);
}

/**
 * Validate tool arguments against schema
 */
export function validateToolArguments(toolName: string, args: any): { valid: boolean; errors?: string[] } {
  const tool = getToolDefinition(toolName);
  if (!tool) {
    return { valid: false, errors: [`Unknown tool: ${toolName}`] };
  }

  const errors: string[] = [];
  const required = tool.inputSchema.required || [];

  // Check required fields
  for (const field of required) {
    if (!(field in args) || args[field] === undefined || args[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Basic type checking
  const properties = tool.inputSchema.properties;
  for (const [key, value] of Object.entries(args)) {
    const propSchema = properties[key];
    if (!propSchema) {
      errors.push(`Unknown field: ${key}`);
      continue;
    }

    if (propSchema.type === 'string' && typeof value !== 'string') {
      errors.push(`Field ${key} must be a string`);
    } else if (propSchema.type === 'number' && typeof value !== 'number') {
      errors.push(`Field ${key} must be a number`);
    } else if (propSchema.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`Field ${key} must be a boolean`);
    } else if (propSchema.type === 'array' && !Array.isArray(value)) {
      errors.push(`Field ${key} must be an array`);
    }
  }

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
}
