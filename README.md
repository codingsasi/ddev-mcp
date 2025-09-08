# DDEV MCP

A **production-ready** Model Context Protocol (MCP) server that provides AI assistants with comprehensive DDEV development environment automation. Built with TypeScript using the official MCP SDK.

**🚀 47+ Tools for Complete DDEV Automation**

Supports all DDEV project types including Drupal, WordPress, Laravel, Symfony, TYPO3, CakePHP, Magento, and many more!

## 🎯 **Perfect Companion to Playwright MCP**

This DDEV MCP server is designed to work seamlessly with your existing Playwright MCP setup, creating a powerful development automation environment:

- **DDEV MCP**: Environment management, database operations, CMS-specific workflows
- **Combined**: Complete development lifecycle automation for any web project

## ✨ **Features**

### 🔧 **Environment Management**
- Start, stop, restart DDEV projects
- Get project status and detailed information
- Access container logs and SSH into services

### 💾 **Database Operations**
- Import/export databases with various formats
- Support for compressed database files
- Target specific databases in multi-db setups

### 🌐 **CMS & Framework Integration**
- **Drupal**: Execute Drush commands, manage modules and themes
- **WordPress**: WP-CLI commands, plugin/theme management, core updates
- **Laravel**: Artisan commands, package management
- **Symfony**: Console commands, bundle management
- **TYPO3**: TYPO3 Console commands, extension management
- **Magento**: Magento CLI, module management
- **And more**: Extensible architecture for any DDEV-supported project type

### 🛡️ **Enterprise Ready**
- Comprehensive error handling and logging
- Input validation and sanitization
- Configurable timeouts and security measures
- TypeScript for type safety

## 📦 **Installation**

### Prerequisites
- Node.js 20+
- DDEV installed and available in PATH
- TypeScript knowledge for team contributions

### Quick Setup

```bash
# Install globally
npm install -g @codingsasi/ddev-mcp

# Or run directly with npx
npx @codingsasi/ddev-mcp --help

# Verify installation
ddev-mcp --version
```

### Development Setup

```bash
git clone <repository-url>
cd ddev-mcp
npm install
npm run build
npm run dev
```

## ⚙️ **Configuration**

### MCP Client Configuration

Add to your `~/.cursor/mcp.json` (alongside your working Playwright MCP):

```json
{
  "mcpServers": {
    "playwright":
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "ddev": {
      "command": "npx",
      "args": ["@codingsasi/ddev-mcp"]
    }
  }
}
```

No additional configuration needed! The server automatically detects your DDEV projects.

### Environment Variables

```bash
# Optional: Set default project path
export DDEV_PROJECT_PATH="/path/to/your/ddev/project"

# Optional: Configure logging level
export DDEV_MCP_LOG_LEVEL="DEBUG"
```

### Simple Directory Handling

The DDEV MCP server operates on the **current working directory** principle:

- **Runs commands in whatever directory the MCP server is invoked from**
- **No complex directory detection or configuration needed**
- **User controls the context by navigating to the correct directory**

#### **Usage Pattern**
```bash
# Navigate to your DDEV project
cd /path/to/your/ddev/project

# Use AI assistant with DDEV MCP commands
# The MCP server will run DDEV commands in the current directory
```

#### **IDE Integration**
When using with IDEs like Cursor:
- The MCP server inherits the IDE's current working directory
- Commands run in the context of your currently open project
- You can ask the AI to change directories if needed

#### **Directory Control**
If you need to run commands in a different directory:
- Ask the AI: *"Change to the /path/to/project directory and run ddev status"*
- Or specify the project path in tool parameters where supported

## 🚀 **Usage Examples**

### Basic DDEV Operations

```
"Use DDEV MCP to start the ddev project environment"
"Get the status of my DDEV project and show me the URLs"
"Restart DDEV with fresh containers"
```

### Database Management

```
"Import the latest production database dump using DDEV MCP"
"Export current database to backup-$(date).sql.gz"
"Import database from /path/to/dump.sql into my project"
```

### CMS-Specific Development

```
# Drupal
"Use DDEV MCP to run drush cr to clear Drupal cache"
"Execute drush cex to export configuration via DDEV"

# WordPress
"Use DDEV MCP to install and activate the Akismet plugin"
"Update WordPress core to the latest version via DDEV"

# Laravel
"Run php artisan migrate using DDEV MCP"
"Execute artisan cache:clear via DDEV"

# Symfony
"Use DDEV MCP to run symfony console cache:clear"
"Execute doctrine:migrations:migrate via DDEV"
```

### Combined Workflows (DDEV + Playwright MCP)

```
"DDEV MCP: Start fresh development environment with latest DB, then Playwright MCP: run smoke tests"
"DDEV MCP: Enable debug mode and clear cache, then Playwright MCP: reproduce the login bug"
"DDEV MCP: Import test data, then Playwright MCP: run end-to-end workflow tests"

# Add-on specific workflows
"DDEV MCP: Clear Redis cache and check memory usage"
"DDEV MCP: Create new Solr core for testing, then query indexed content"
"DDEV MCP: Install Playwright browsers, then run accessibility tests"

# Directory navigation workflows
"DDEV MCP: Go to my WordPress project at ~/Projects/mysite and start it"
"DDEV MCP: Navigate to /home/user/drupal-site directory and check project status"
"DDEV MCP: Go to the correct project folder and run database import"
```

## 🛠️ **Available Tools**

### **Core DDEV Tools**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_start` | Start DDEV environment | `projectPath`, `skipHooks` |
| `ddev_stop` | Stop DDEV environment | `projectPath` |
| `ddev_restart` | Restart DDEV environment | `projectPath` |
| `ddev_status` | Get project status | `projectPath` |
| `ddev_describe` | Get detailed project info | `projectPath` |
| `ddev_list` | List all DDEV projects | - |

### **Database Operations**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_import_db` | Import database | `projectPath`, `src`, `targetDb` |
| `ddev_export_db` | Export database | `projectPath`, `file`, `compressionType` |
| `ddev_snapshot` | Manage database snapshots | `projectPath`, `action`, `name` |

### **Configuration & Project Management**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_config` | Configure DDEV project | `projectName`, `projectType`, `docroot`, `phpVersion` |
| `ddev_delete` | Delete project | `projectPath`, `projectName`, `omitSnapshot`, `yes` |
| `ddev_clean` | Clean DDEV items | `projectPath`, `all`, `dryRun` |

### **Service Management**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_logs` | Get service logs | `projectPath`, `service`, `tail` |
| `ddev_ssh` | SSH into container | `projectPath`, `command`, `service` |
| `ddev_exec` | Execute command in container | `projectPath`, `command`, `service`, `workdir` |

### **File Operations**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_import_files` | Import files directory | `projectPath`, `src`, `extractPath` |

### **Development Tools**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_composer` | Execute Composer commands | `projectPath`, `command`, `args` |
| `ddev_drush` | Execute Drush commands (Drupal) | `projectPath`, `command`, `args` |
| `ddev_debug` | Run debugging commands | `projectPath`, `command` |

### **Sharing & Networking**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_share` | Share project via ngrok | `projectPath`, `ngrokArgs` |
| `ddev_hostname` | Manage hostfile entries | `projectPath`, `action`, `hostname` |

### **Global Operations**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_poweroff` | Stop all DDEV projects | `timeout` |
| `ddev_version` | Get DDEV version info | `timeout` |

### **Directory Navigation**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_go_to_project_directory` | Navigate to DDEV project directory | `path`, `verify` |

### **Add-on & Service-Specific Tools**

#### **Redis Operations**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_redis_cli` | Execute Redis CLI commands | `projectPath`, `command` |
| `ddev_redis_info` | Get Redis server information | `projectPath`, `section` |

#### **Solr Search Engine**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_solr_admin` | Solr admin operations | `projectPath`, `action`, `core`, `configSet` |
| `ddev_solr_query` | Execute Solr search queries | `projectPath`, `core`, `query`, `rows`, `fields` |

#### **Playwright Testing**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_playwright` | Run Playwright commands | `projectPath`, `action`, `testFilter`, `browser`, `headed` |
| `ddev_playwright_install` | Install Playwright browsers | `projectPath`, `browser`, `withDeps` |

### **CMS-Specific Tools**

#### **Drupal Tools**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_drush` | Execute Drush commands | `projectPath`, `command`, `args` |
| `ddev_composer` | Execute Composer commands | `projectPath`, `command`, `args` |

#### **WordPress Tools**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_wp_cli` | Execute WP-CLI commands | `projectPath`, `command`, `args` |
| `ddev_wp_site_info` | Get WordPress site information | `projectPath` |

#### **WordPress Plugin Management**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_wp_plugin_install` | Install WordPress plugins | `projectPath`, `plugin`, `activate` |
| `ddev_wp_plugin_toggle` | Activate/deactivate plugins | `projectPath`, `plugin`, `action` |
| `ddev_wp_plugin_list` | List WordPress plugins | `projectPath`, `status` |
| `ddev_wp_plugin_manage` | Comprehensive plugin management | `projectPath`, `action`, `plugin`, `version` |

#### **WordPress Theme Management**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_wp_theme_install` | Install WordPress themes | `projectPath`, `theme`, `activate` |
| `ddev_wp_theme_activate` | Activate WordPress theme | `projectPath`, `theme` |
| `ddev_wp_theme_manage` | Comprehensive theme management | `projectPath`, `action`, `theme`, `version` |

#### **WordPress User & Maintenance**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_wp_user_manage` | User operations (create, update, delete, list) | `projectPath`, `action`, `user`, `userLogin`, `role` |
| `ddev_wp_core_update` | Update WordPress core | `projectPath`, `version`, `force` |
| `ddev_wp_rewrite_flush` | Flush rewrite rules | `projectPath` |
| `ddev_wp_search_replace` | Database search/replace | `projectPath`, `oldUrl`, `newUrl` |
| `ddev_wp_maintenance` | Cache, cron, and maintenance operations | `projectPath`, `action`, `enable` |

> **Extensible Architecture**: Additional CMS tools can be easily added for Laravel (Artisan), Symfony (Console), TYPO3, Magento, and other [DDEV-supported frameworks](https://docs.ddev.com/en/stable/users/quickstart/).

## 🧪 **Development & Testing**

### Build and Test

```bash
# Build TypeScript
npm run build

# Run tests
npm test

# Development with hot reload
npm run dev

# Clean build artifacts
npm run clean
```

### Code Quality

- **TypeScript**: Full type safety and IntelliSense support
- **ESLint**: Code quality and consistency
- **Jest**: Comprehensive test coverage
- **Logging**: Structured logging with configurable levels

## 🔧 **Architecture**

### Project Structure

```
src/
├── server/          # MCP server implementation
│   ├── index.ts     # Main server class
│   └── tools.ts     # Tool definitions and validation
├── ddev/            # DDEV operations
│   └── operations.ts # Core DDEV command implementations
├── utils/           # Utilities
│   ├── logger.ts    # Structured logging
│   └── command.ts   # Safe command execution
├── types/           # TypeScript definitions
│   └── index.ts     # Type definitions
└── index.ts         # CLI entry point
```

### Supported DDEV Project Types

Based on the [DDEV CMS Quickstarts](https://docs.ddev.com/en/stable/users/quickstart/), this MCP server works with:

**Content Management Systems:**
- Backdrop, Drupal, WordPress, TYPO3, Joomla, ProcessWire

**E-commerce Platforms:**
- Magento 2, OpenMage, Shopware

**PHP Frameworks:**
- Laravel, Symfony, CakePHP, Pimcore, Sulu

**Other Platforms:**
- Craft CMS, ExpressionEngine, Grav, Statamic, Silverstripe CMS, Moodle

**And more!** The architecture supports any DDEV project type through generic commands and extensible CMS-specific integrations.

### Design Principles

1. **Following Playwright MCP Patterns**: Proven architecture and error handling
2. **Official MCP SDK**: Using `@modelcontextprotocol/sdk` for reliability
3. **Type Safety**: Full TypeScript implementation
4. **Security**: Input validation and command sanitization
5. **Observability**: Comprehensive logging and error reporting

## 🤝 **Contributing**

This project is designed for team collaboration with familiar JavaScript/TypeScript patterns:

1. **Fork and Clone**: Standard GitHub workflow
2. **Install Dependencies**: `npm install`
3. **Make Changes**: Follow existing patterns
4. **Test**: `npm test` and manual testing
5. **Submit PR**: With clear description

### Coding Standards

- TypeScript strict mode enabled
- ESLint configuration for consistency
- Comprehensive error handling
- Unit tests for new features
- Documentation updates

## 📚 **Integration Examples**

### Development Workflow Examples

```bash
# Morning startup routine
"DDEV MCP: Start development environment and import latest production data"
"Playwright MCP: Navigate to site and take screenshot to verify"

# Feature development
"DDEV MCP: Enable new feature and clear cache"
"Playwright MCP: Test the new feature functionality"

# Bug investigation
"DDEV MCP: Enable Xdebug and tail error logs"
"Playwright MCP: Reproduce bug scenario and capture state"

# Deployment preparation
"DDEV MCP: Run database updates and build assets"
"Playwright MCP: Run full regression test suite"
```

## 🔒 **Security Considerations**

### **Platform.sh Integration Safety**

The `ddev_platform` tool includes built-in safety measures to prevent accidental execution of potentially destructive commands:

- **Required Confirmation**: All Platform.sh commands require explicit user confirmation via `confirmExecution: true`
- **Production Protection**: Commands that can affect production environments are blocked without confirmation
- **Clear Warnings**: Detailed error messages explain why commands were blocked

**Example:**
```bash
# This will be blocked with a security warning
"DDEV MCP: Run platform environment:redeploy"

# This will execute (with explicit confirmation)
"DDEV MCP: Run platform environment:list with confirmExecution: true"
```

### **General Security Best Practices**

- **Review Commands**: Always review DDEV commands before execution
- **Use Dry Runs**: Many tools support `dryRun` mode for safe testing
- **Backup First**: Export databases before running destructive operations
- **Test Locally**: Verify commands work in development before production use

## 🆘 **Troubleshooting**

### Common Issues

**MCP Server Not Connecting**
- Restart Cursor to reload MCP connections
- Check that DDEV is installed: `ddev version`
- Verify Node.js 22+: `node --version`

**Command Timeouts**
- Increase timeout values for long operations
- Check DDEV project status
- Review logs for specific errors

**Permission Issues**
- Ensure DDEV has proper permissions
- Check project path accessibility
- Verify Docker daemon is running

## 📄 **License**

MIT License - see LICENSE file for details.

## 🙏 **Acknowledgments**

- Built with the official [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Inspired by the excellent [Playwright MCP server](https://github.com/microsoft/playwright-mcp)
- Designed for [DDEV](https://ddev.readthedocs.io/) development environments

---

## 📚 **Additional Resources**

- **[Extending Guide](EXTENDING.md)** - How to add support for new CMS/frameworks
- **[WordPress Examples](WORDPRESS_EXAMPLES.md)** - Comprehensive WordPress development workflows
- **[Usage Examples](USAGE_EXAMPLES.md)** - Real-world development scenarios
- **[DDEV CMS Quickstarts](https://docs.ddev.com/en/stable/users/quickstart/)** - Official DDEV project type documentation
- **[Playwright Documentation](https://playwright.dev/docs/intro)** - Browser automation reference
- **[DDEV Documentation](https://ddev.readthedocs.io/)** - Local development environment guide

**Ready to supercharge your DDEV development workflow with AI assistance for any web project!** 🚀
