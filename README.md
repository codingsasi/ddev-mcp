# DDEV MCP

A **production-ready** Model Context Protocol (MCP) server that provides AI assistants with DDEV development environment automation. Built with TypeScript using the official MCP SDK.

** 13 Essential Tools**

Streamlined tool set optimized for AI models. Supports all DDEV project types including Drupal, WordPress, Laravel, Symfony, TYPO3, CakePHP, Magento, and many more through the powerful `ddev_exec` command!

## **Complete DDEV Development Automation**

This DDEV MCP server provides comprehensive development environment automation for any web project:

- **Environment Management**: Start, stop, restart DDEV projects
- **Database Operations**: Import/export, snapshots, migrations
- **CMS-Specific Workflows**: Drupal, WordPress, Laravel, etc

## **Features**

### **Environment Management**
- Start, stop, restart DDEV projects
- Get project status and detailed information
- Access container logs and SSH into services

### **Database Operations**
- Import/export databases with various formats
- Support for compressed database files
- Target specific databases in multi-db setups

### **Command Executor (exec)**
- **Single `ddev_exec` tool** handles all CMS/framework commands
- **Drupal**: Execute Drush commands (`drush cr`, `drush cex`, etc.)
- **WordPress**: WP-CLI commands (`wp plugin list`, `wp core update`, etc.)
- **Laravel**: Artisan commands (`php artisan migrate`, etc.)
- **Symfony**: Console commands (`symfony console cache:clear`, etc.)
- **Composer**: Package management (`composer install`, `composer update`, etc.)
- **Redis, Solr, MySQL**: Direct service commands
- **Testing**: Playwright, Cypress, PHPUnit, and custom test runners
- **And more**: Any command you can run in a DDEV container!

### 🛡️ **Production Ready**
- Thorough error handling and logging
- Input validation and sanitization
- Configurable timeouts and security measures
- TypeScript for type safety
- **Dangerous Command Protection**: Built-in safety system for production-affecting commands

## 📦 **Installation**

### Prerequisites
- **Node.js 20+** (Node.js 22+ preferred for best performance)
- DDEV installed and available in PATH
- TypeScript knowledge for team contributions

### Quick Setup

```bash
# Install globally
npm install -g ddev-mcp

# Or run directly with npx
npx ddev-mcp --help

# Verify installation
ddev-mcp --version
```

### Node.js Version Requirements

- **Minimum**: Node.js 20.0.0+
- **Recommended**: Node.js 22.0.0+ (for best performance and latest features)
- **Check your version**: `node --version`

### Development Setup

```bash
git clone git@github.com:codingsasi/ddev-mcp.git
cd ddev-mcp
npm install
npm run build
npm run dev
```

## ⚙️ **Configuration**

### MCP Client Configuration

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ddev": {
      "command": "npx",
      "args": ["ddev-mcp"],
      "env": {
        "ALLOW_DANGEROUS_COMMANDS": "false" // true if you want ddev to run commands like `platform redeploy -emaster`
      },
    }
  }
}
```

No additional configuration needed! The server automatically detects your DDEV projects.

### Environment Variables

```bash
# Optional: Configure logging level
export DDEV_MCP_LOG_LEVEL="DEBUG"

# Safety: Allow dangerous commands (default: false)
export ALLOW_DANGEROUS_COMMANDS="true"
```

### 🛡️ **Dangerous Command Protection**

The DDEV MCP server includes built-in protection against dangerous commands that could affect production environments:

- **Platform.sh commands** like `environment:redeploy`, `environment:delete` are blocked by default
- **Database operations** that could delete data are protected
- **File operations** that could remove important files are safeguarded

#### **Enabling Dangerous Commands**

To allow dangerous commands (use with caution):

```bash
export ALLOW_DANGEROUS_COMMANDS="true"
```

#### **Adding New Dangerous Commands**

Contributors can easily add dangerous command patterns in `src/config/dangerous-commands.ts`. See [DANGEROUS_COMMANDS.md](docs/DANGEROUS_COMMANDS.md) for detailed instructions.

### Simple Directory Handling

The DDEV MCP server operates on the **current working directory** principle:

- **Runs commands in whatever directory the MCP server is invoked from**
- **No complex directory detection or configuration needed**
- **User controls the context by navigating to the correct directory**

### CMS-Specific Development Usage (via ddev_exec)

```
# Drupal
"Use ddev mcp to clear Drupal cache"
"Use ddev mcp to execute drush cex to export configuration"
"Use ddev mcp to use drush uli to get a one-time login link"

# WordPress
"Use ddev mcp to install and activate the Akismet plugin with wp plugin install"
"ddev mcp: Run wp core update to update WordPress"
"ddev mcp: Run wp cache flush to clear caches"

# Composer
"Use ddev mcp to run composer install using ddev_exec"
"ddev mcp: Update packages with composer update"
```

### Other things you can do

```
"DDEV MCP: Start fresh development environment with latest DB"
"DDEV MCP: Enable debug mode and clear cache for debugging"
"DDEV MCP: Import test data for testing"

# Add-on specific workflows (via ddev_exec)
"DDEV MCP: Clear Redis cache with redis-cli FLUSHALL"
"DDEV MCP: Check Redis memory with redis-cli INFO memory"
"DDEV MCP: Query Solr with curl commands"
"DDEV MCP: Run MySQL queries with mysql -e"
"DDEV MCP: Execute Playwright tests"

# Directory navigation workflows
"DDEV MCP: Go to my WordPress project at ~/Projects/mysite and start it"
"DDEV MCP: Navigate to /home/user/drupal-site directory and check project status"
"DDEV MCP: Go to the correct project folder and run database import"
```

## 🛠️ **Available Tools (13 Total)**

### **Core Project Management (6 tools)**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_start` | Start DDEV environment | `projectPath`, `skipHooks` |
| `ddev_stop` | Stop DDEV environment | `projectPath` |
| `ddev_restart` | Restart DDEV environment | `projectPath` |
| `ddev_describe` | Get detailed project info | `projectPath` |
| `ddev_list` | List all DDEV projects | `activeOnly` |
| `ddev_logs` | Get service logs | `projectPath`, `service`, `tail` |

### **Database Operations (3 tools)**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_import_db` | Import database | `projectPath`, `src`, `targetDb` |
| `ddev_export_db` | Export database | `projectPath`, `file`, `compressionType` |
| `ddev_snapshot` | Manage database snapshots | `projectPath`, `action`, `name` |

### **Universal Command Executor (1 tool - THE MOST IMPORTANT)**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_exec` | **Execute ANY command in container** | `projectPath`, `command`, `service`, `workdir` |

### **Utilities (3 tools)**
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `ddev_version` | Get DDEV version info | `timeout` |
| `ddev_poweroff` | Stop all DDEV projects | `timeout` |
| `message_complete_notification` | Send OS notification | `title`, `message` |


## 🧪 **Development & Testing**

### Build and Test

- Clone the repo to `/path/to/repo/for/ddev-mcp/`
- Run `npm run build`
- and add the following to mcp.json file.

```json
{
  "mcpServers": {
    "ddev": {
      "command": "npx",
      "args": [
        "/path/to/repo/for/ddev-mcp/dist/index.js"
      ],
      "env": {
        "DDEV_MCP_LOG_LEVEL": "INFO"
      },
      "timeout": 30000
    },
  }
}
```

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

## 🤝 **Contributing**

This project is designed for team collaboration with familiar JavaScript/TypeScript patterns:

1. **Fork and Clone**: Standard GitHub workflow
2. **Install Dependencies**: `npm install`
2. **Build**: `npm run build`
3. **Make Changes**: Follow existing patterns
4. **Test**: Manually (Use it in your ddev project)
5. **Submit PR**: With clear description

### Coding Standards

- TypeScript strict mode enabled
- ESLint configuration for consistency
- Comprehensive error handling
- Unit tests for new features
- Documentation updates


## 🙏 **Acknowledgments**

- Built with the official [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Designed for [DDEV](https://ddev.readthedocs.io/) development environments

---

### **External Resources**
- **[DDEV CMS Quickstarts](https://docs.ddev.com/en/stable/users/quickstart/)** - Official DDEV project type documentation
- **[DDEV Documentation](https://ddev.readthedocs.io/)** - Local development environment guide

**Ready to supercharge your DDEV development workflow with AI assistance for any web project!** 🚀
