/**
 * MCP Tool Definitions for DDEV Server
 * Following Playwright MCP patterns for tool registration and handling
 */

import { ToolDefinition } from '../types/index.js';

export const DDEV_TOOLS: ToolDefinition[] = [
  {
    name: 'ddev_start',
    description: 'Start a DDEV project environment',
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
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      },
      required: ['projectPath']
    }
  },

  {
    name: 'ddev_stop',
    description: 'Stop a DDEV project environment',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 60000
        }
      },
      required: ['projectPath']
    }
  },

  {
    name: 'ddev_restart',
    description: 'Restart a DDEV project environment',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 180000
        }
      },
      required: ['projectPath']
    }
  },

  {
    name: 'ddev_describe',
    description: 'Get detailed information about a DDEV project. Same as ddev status.',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      }
    }
  },

  {
    name: 'ddev_list',
    description: 'List all DDEV projects with their status and information',
    inputSchema: {
      type: 'object',
      properties: {
        activeOnly: {
          type: 'boolean',
          description: 'Show only running projects',
          default: false
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      }
    }
  },

  {
    name: 'ddev_import_db',
    description: 'Import a database into DDEV project',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        src: {
          type: 'string',
          description: 'Source database file path'
        },
        srcRaw: {
          type: 'string',
          description: 'Raw SQL to import'
        },
        extractPath: {
          type: 'string',
          description: 'Path to extract compressed files'
        },
        noActivatePlugins: {
          type: 'boolean',
          description: 'Skip WordPress plugin activation',
          default: false
        },
        targetDb: {
          type: 'string',
          description: 'Target database name'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 300000
        }
      }
    }
  },

  {
    name: 'ddev_export_db',
    description: 'Export database from DDEV project',
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
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 300000
        }
      }
    }
  },

  {
    name: 'ddev_logs',
    description: 'Get logs from DDEV services',
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
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      }
    }
  },

  // Database snapshots
  {
    name: 'ddev_snapshot',
    description: 'Create, list, or restore database snapshots',
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
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 300000
        }
      }
    }
  },


  // Service management - PRIMARY COMMAND EXECUTOR
  {
    name: 'ddev_exec',
    description: `Execute any command in a DDEV service container. This is the PRIMARY tool for running commands in your DDEV project.

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
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      },
      required: ['projectPath', 'command']
    }
  },

  // Global operations
  {
    name: 'ddev_poweroff',
    description: 'Stop all DDEV projects and containers',
    inputSchema: {
      type: 'object',
      properties: {
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      }
    }
  },

  {
    name: 'ddev_version',
    description: 'Get DDEV version and component information',
    inputSchema: {
      type: 'object',
      properties: {
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
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
