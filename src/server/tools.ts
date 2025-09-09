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
    name: 'ddev_status',
    description: 'Get the status of a DDEV project',
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
    name: 'ddev_describe',
    description: 'Get detailed information about a DDEV project',
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
    name: 'ddev_drush',
    description: 'Execute Drush commands in DDEV environment',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Drush command to execute'
        },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Additional arguments for the Drush command'
        },
        uri: {
          type: 'string',
          description: 'URI for multisite Drupal installations'
        },
        root: {
          type: 'string',
          description: 'Drupal root path'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      },
      required: ['command']
    }
  },

  {
    name: 'ddev_composer',
    description: 'Execute Composer commands in DDEV environment',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Composer command to execute'
        },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Additional arguments for the Composer command'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 300000
        }
      },
      required: ['command']
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

  {
    name: 'ddev_ssh',
    description: 'Get SSH connection info and container details (AI-friendly)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        service: {
          type: 'string',
          description: 'Service to get SSH info for (default: web)',
          default: 'web'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      }
    }
  },

  // Configuration and project management
  {
    name: 'ddev_config',
    description: 'Show DDEV project configuration or modify it (AI-friendly, non-interactive)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        showConfig: {
          type: 'boolean',
          description: 'Show current configuration location (default behavior if no other options specified)',
          default: true
        },
        projectName: {
          type: 'string',
          description: 'Project name (only for modifications)'
        },
        projectType: {
          type: 'string',
          description: 'Project type (drupal, wordpress, laravel, etc.) (only for modifications)'
        },
        docroot: {
          type: 'string',
          description: 'Document root relative path (e.g., web, public, htdocs) (only for modifications)'
        },
        phpVersion: {
          type: 'string',
          description: 'PHP version (e.g., 8.1, 8.2, 8.3) (only for modifications)'
        },
        database: {
          type: 'string',
          description: 'Database type:version (e.g., mariadb:10.11, mysql:8.0) (only for modifications)'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      }
    }
  },

  {
    name: 'ddev_delete',
    description: 'Remove all project information for an existing project (DESTRUCTIVE - use with caution)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        projectName: {
          type: 'string',
          description: 'Project name to delete (REQUIRED for safety)'
        },
        omitSnapshot: {
          type: 'boolean',
          description: 'Skip database snapshot before deletion (NOT recommended)',
          default: false
        },
        confirmDelete: {
          type: 'boolean',
          description: 'Explicit confirmation that you want to delete this project (REQUIRED)',
          default: false
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 60000
        }
      },
      required: ['projectName', 'confirmDelete']
    }
  },

  {
    name: 'ddev_clean',
    description: 'Remove items DDEV has created (containers, images, volumes)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        all: {
          type: 'boolean',
          description: 'Clean all DDEV Docker items',
          default: false
        },
        dryRun: {
          type: 'boolean',
          description: 'Show what would be cleaned without doing it',
          default: false
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
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

  // File operations
  {
    name: 'ddev_import_files',
    description: 'Import files directory or archive to DDEV project',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        src: {
          type: 'string',
          description: 'Source directory or archive (.tar, .tar.gz, .tar.bz2, .tar.xz, .tgz, .zip) to import'
        },
        target: {
          type: 'string',
          description: 'Target upload directory (defaults to first upload dir)'
        },
        extractPath: {
          type: 'string',
          description: 'Path to extract within the archive'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 300000
        }
      },
      required: ['src']
    }
  },

  // Debugging and diagnostics
  {
    name: 'ddev_debug',
    description: 'Run DDEV debugging and diagnostic commands',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Debug command to run',
          enum: ['test', 'dockercheck', 'compose-config', 'configyaml', 'check-db-match', 'download-images']
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      }
    }
  },

  // Service management
  {
    name: 'ddev_exec',
    description: 'Execute any command in a DDEV service container (most flexible tool for any operation)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Command to execute (e.g., "drush cr", "composer install", "npm run build", "redis-cli ping", "curl http://solr:8983/solr/")'
        },
        service: {
          type: 'string',
          description: 'Service to execute in: web (default), db, redis, solr, or any other service. AUTO-ROUTING: drush/composer/npm/php commands → web, mysql/mariadb commands → db, redis-cli commands → redis, solr commands → solr',
          default: 'web'
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

  {
    name: 'ddev_help',
    description: 'Get help information for DDEV commands and discover available operations',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Specific DDEV command to get help for (e.g., "start", "composer", "drush"). Leave empty for general help.'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      }
    }
  },

  // Sharing and external access
  {
    name: 'ddev_share',
    description: 'Share project on the internet via ngrok',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        ngrokArgs: {
          type: 'string',
          description: 'Additional arguments to pass to ngrok'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      }
    }
  },

  // Hostname management
  {
    name: 'ddev_hostname',
    description: 'Manage hostfile entries for DDEV projects',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        action: {
          type: 'string',
          description: 'Action to perform',
          enum: ['add', 'remove', 'list'],
          default: 'list'
        },
        hostname: {
          type: 'string',
          description: 'Hostname to add or remove'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      }
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

  // Directory navigation
  {
    name: 'ddev_go_to_project_directory',
    description: 'Navigate to a DDEV project directory and verify it contains a valid DDEV configuration',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path to the DDEV project directory to navigate to'
        },
        verify: {
          type: 'boolean',
          description: 'Verify the directory contains a valid DDEV project',
          default: true
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      },
      required: ['path']
    }
  },

  // Add-on and service-specific tools

  // Redis operations
  {
    name: 'ddev_redis_cli',
    description: 'Execute Redis CLI commands (non-interactive, returns output)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Redis command to execute. Useful commands: "INFO" (server info), "PING" (test connection), "KEYS *" (list keys), "DBSIZE" (key count), "MEMORY USAGE key" (memory usage), "FLUSHDB" (clear database). Defaults to INFO.',
          default: 'INFO'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      },
      required: ['projectPath']
    }
  },

  {
    name: 'ddev_redis_info',
    description: 'Get Redis server information and statistics',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        section: {
          type: 'string',
          description: 'Specific info section (server, clients, memory, persistence, stats, etc.)'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      }
    }
  },

  // Native service commands
  {
    name: 'ddev_solr',
    description: 'Execute native DDEV Solr commands',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Solr command (e.g., "status", "create -c corename -n configname -shards 1 -replicationFactor 1", "delete -c corename")',
          default: 'status'
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
    name: 'ddev_solr_zk',
    description: 'Execute DDEV Solr ZooKeeper commands',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'ZooKeeper command (e.g., "ls /collections", "ls /configs", "upconfig -d configdir -n configname")',
          default: 'ls /collections'
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
    name: 'ddev_mysql',
    description: 'Execute MySQL/MariaDB commands in database container',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        query: {
          type: 'string',
          description: 'SQL query to execute (e.g., "SHOW DATABASES", "SELECT * FROM users LIMIT 10")',
          default: 'SHOW DATABASES'
        },
        database: {
          type: 'string',
          description: 'Database name to use (defaults to project database)',
          default: 'db'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 30000
        }
      },
      required: ['projectPath']
    }
  },

  // Platform.sh integration
  {
    name: 'ddev_platform',
    description: 'Execute Platform.sh CLI commands in web container (Dangerous commands blocked unless ALLOW_DANGEROUS_COMMANDS=true)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'Platform.sh command (e.g., "environment:list", "db:dump", "environment:redeploy", "-edev ssh -- drush status"). Dangerous commands are blocked unless ALLOW_DANGEROUS_COMMANDS=true.',
          default: 'environment:list'
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

  // Playwright operations
  {
    name: 'ddev_playwright',
    description: 'Execute Playwright commands for browser testing (AI-friendly, non-interactive)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        action: {
          type: 'string',
          description: 'Playwright action to perform',
          enum: ['test', 'install', 'show-report', 'list-browsers', 'version'],
          default: 'version'
        },
        testFilter: {
          type: 'string',
          description: 'Test filter pattern (for test action)'
        },
        browser: {
          type: 'string',
          description: 'Browser to use (chromium, firefox, webkit)',
          enum: ['chromium', 'firefox', 'webkit']
        },
        headed: {
          type: 'boolean',
          description: 'Run tests in headed mode',
          default: false
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      }
    }
  },

  {
    name: 'ddev_playwright_install',
    description: 'Install Playwright browsers and dependencies',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        browser: {
          type: 'string',
          description: 'Specific browser to install (leave empty for all)'
        },
        withDeps: {
          type: 'boolean',
          description: 'Install system dependencies',
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
  // WordPress-specific tools
  {
    name: 'ddev_wp_cli',
    description: 'Execute WP-CLI commands in DDEV WordPress environment',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        command: {
          type: 'string',
          description: 'WP-CLI command to execute'
        },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Additional arguments for the WP-CLI command'
        },
        url: {
          type: 'string',
          description: 'WordPress site URL for multisite installations'
        },
        path: {
          type: 'string',
          description: 'WordPress installation path'
        },
        skipPlugins: {
          type: 'boolean',
          description: 'Skip loading plugins',
          default: false
        },
        skipThemes: {
          type: 'boolean',
          description: 'Skip loading themes',
          default: false
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      },
      required: ['command']
    }
  },

  {
    name: 'ddev_wp_site_info',
    description: 'Get WordPress site information and version details',
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
      }
    }
  },

  {
    name: 'ddev_wp_plugin_install',
    description: 'Install WordPress plugins via WP-CLI',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        plugin: {
          type: 'string',
          description: 'Plugin slug or ZIP URL to install'
        },
        activate: {
          type: 'boolean',
          description: 'Activate plugin after installation',
          default: false
        },
        version: {
          type: 'string',
          description: 'Specific version to install'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      },
      required: ['plugin']
    }
  },

  {
    name: 'ddev_wp_plugin_toggle',
    description: 'Activate or deactivate WordPress plugins',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        plugin: {
          type: 'string',
          description: 'Plugin slug to activate/deactivate'
        },
        action: {
          type: 'string',
          enum: ['activate', 'deactivate'],
          description: 'Action to perform on the plugin'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 60000
        }
      },
      required: ['plugin', 'action']
    }
  },

  {
    name: 'ddev_wp_plugin_list',
    description: 'List WordPress plugins with their status',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        status: {
          type: 'string',
          enum: ['active', 'inactive', 'all'],
          description: 'Filter plugins by status',
          default: 'all'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 60000
        }
      }
    }
  },

  {
    name: 'ddev_wp_theme_install',
    description: 'Install WordPress themes via WP-CLI',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        theme: {
          type: 'string',
          description: 'Theme slug or ZIP URL to install'
        },
        activate: {
          type: 'boolean',
          description: 'Activate theme after installation',
          default: false
        },
        version: {
          type: 'string',
          description: 'Specific version to install'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      },
      required: ['theme']
    }
  },

  {
    name: 'ddev_wp_theme_activate',
    description: 'Activate a WordPress theme',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        theme: {
          type: 'string',
          description: 'Theme slug to activate'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 60000
        }
      },
      required: ['theme']
    }
  },

  {
    name: 'ddev_wp_core_update',
    description: 'Update WordPress core to latest or specific version',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        version: {
          type: 'string',
          description: 'Specific WordPress version to update to'
        },
        force: {
          type: 'boolean',
          description: 'Force update even if already up to date',
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

  {
    name: 'ddev_wp_rewrite_flush',
    description: 'Flush WordPress rewrite rules',
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
    name: 'ddev_wp_search_replace',
    description: 'WordPress database search and replace (useful for URL changes)',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        oldUrl: {
          type: 'string',
          description: 'Old URL to search for'
        },
        newUrl: {
          type: 'string',
          description: 'New URL to replace with'
        },
        dryRun: {
          type: 'boolean',
          description: 'Perform a dry run without making changes',
          default: false
        },
        skipColumns: {
          type: 'array',
          items: { type: 'string' },
          description: 'Database columns to skip during search/replace'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      },
      required: ['oldUrl', 'newUrl']
    }
  },

  // Enhanced WordPress Plugin Management
  {
    name: 'ddev_wp_plugin_manage',
    description: 'Comprehensive WordPress plugin management',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        action: {
          type: 'string',
          description: 'Plugin action to perform',
          enum: ['list', 'install', 'activate', 'deactivate', 'delete', 'update', 'search', 'status', 'get']
        },
        plugin: {
          type: 'string',
          description: 'Plugin slug or name (required for most actions)'
        },
        version: {
          type: 'string',
          description: 'Specific plugin version to install'
        },
        activate: {
          type: 'boolean',
          description: 'Activate plugin after installation',
          default: false
        },
        force: {
          type: 'boolean',
          description: 'Force the action (for updates/installs)',
          default: false
        },
        all: {
          type: 'boolean',
          description: 'Apply to all plugins (for updates)',
          default: false
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      }
    }
  },

  // WordPress Theme Management
  {
    name: 'ddev_wp_theme_manage',
    description: 'Comprehensive WordPress theme management',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        action: {
          type: 'string',
          description: 'Theme action to perform',
          enum: ['list', 'install', 'activate', 'delete', 'update', 'search', 'status', 'get']
        },
        theme: {
          type: 'string',
          description: 'Theme slug or name (required for most actions)'
        },
        version: {
          type: 'string',
          description: 'Specific theme version to install'
        },
        activate: {
          type: 'boolean',
          description: 'Activate theme after installation',
          default: false
        },
        force: {
          type: 'boolean',
          description: 'Force the action (for updates/installs)',
          default: false
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 120000
        }
      }
    }
  },

  // WordPress User Management
  {
    name: 'ddev_wp_user_manage',
    description: 'WordPress user management operations',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        action: {
          type: 'string',
          description: 'User action to perform',
          enum: ['list', 'create', 'update', 'delete', 'get', 'reset-password']
        },
        user: {
          type: 'string',
          description: 'User ID, login, or email'
        },
        userLogin: {
          type: 'string',
          description: 'User login name (for create)'
        },
        userEmail: {
          type: 'string',
          description: 'User email (for create)'
        },
        userPass: {
          type: 'string',
          description: 'User password (for create/reset)'
        },
        role: {
          type: 'string',
          description: 'User role (administrator, editor, author, contributor, subscriber)'
        },
        displayName: {
          type: 'string',
          description: 'User display name'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 60000
        }
      }
    }
  },

  // WordPress Cache and Maintenance
  {
    name: 'ddev_wp_maintenance',
    description: 'WordPress maintenance and cache operations',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the DDEV project directory'
        },
        action: {
          type: 'string',
          description: 'Maintenance action to perform',
          enum: ['cache-flush', 'rewrite-flush', 'cron-run', 'cron-list', 'maintenance-mode']
        },
        enable: {
          type: 'boolean',
          description: 'Enable/disable maintenance mode',
          default: true
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          default: 60000
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
