# DDEV MCP Server Usage Examples

## 🎯 **Real-World ddev Development Scenarios**

Here are practical examples of how DDEV MCP integrates with your development workflow.

### **🌅 Morning Development Startup**

```bash
# DDEV workflow
"Use DDEV MCP to start ddev environment and import latest production database"
```

**What happens:**
1. DDEV MCP: `ddev start` in the project directory
2. DDEV MCP: `ddev import-db --src=/path/to/latest-prod-dump.sql.gz`

### **🔧 Feature Development Cycle**

```bash
# Enable new module and test
"DDEV MCP: Enable the new custom module and clear Drupal cache"
```

**DDEV MCP commands:**
- `ddev drush en <module_name> -y`
- `ddev drush cr`

### **🐛 Bug Investigation Workflow**

```bash
# Debug mode + error reproduction
"DDEV MCP: Enable Xdebug and tail error logs"
```

**DDEV MCP sequence:**
1. `ddev ssh` to enable Xdebug
2. `ddev logs --follow --tail=50`
3. Monitor for errors during reproduction

### **📊 Database Management**

```bash
# Platform.sh integration (REQUIRES USER CONFIRMATION)
"DDEV MCP: Import the latest Platform.sh master database and run pending updates"
```

**Command sequence:**
```bash
# Download from Platform.sh (you'd run this separately)
platform db:dump -e master -f latest-master.sql.gz

# Then via DDEV MCP (with confirmation):
ddev import-db --src=latest-master.sql.gz
ddev drush updb -y
ddev drush cim -y

# Platform.sh commands require explicit confirmation:
# "DDEV MCP: Run 'platform environment:list' with confirmExecution: true"
```

**⚠️ Security Note:** Platform.sh commands can affect production environments. The `ddev_platform` tool requires explicit user confirmation (`confirmExecution: true`) for safety.

### **🎨 Theme Development**

```bash
# Custom theme workflow
"DDEV MCP: Build custom theme assets and restart services"
```

**DDEV MCP commands:**
- `ddev ssh "cd themes/custom && npm run build"`
- `ddev restart`

### **🧪 Test Environment Setup**

```bash
# Fresh test environment
"DDEV MCP: Create clean test environment with test users"
```

**DDEV MCP preparation:**
```bash
ddev import-db --src=clean-test-db.sql
ddev drush user:create testuser --mail=test@example.com --password=testpass  # Create test user
ddev drush cr
```

## 🎭 **Advanced Workflows**

### **Performance Testing Pipeline**

```bash
"DDEV MCP: Configure for performance testing with production-like settings"
```

**DDEV MCP setup:**
- Disable Xdebug: `ddev ssh "sudo phpdismod xdebug"`
- Enable production caching
- Import large dataset

### **Continuous Integration Simulation**

```bash
"DDEV MCP: Run the complete CI pipeline locally - fresh DB, run updates, build assets"
```

**Full CI simulation:**
1. **DDEV MCP**: Fresh environment setup
2. **DDEV MCP**: Database import and updates
3. **DDEV MCP**: Asset building
4. **DDEV MCP**: Log collection and cleanup

### **Release Preparation**

```bash
"DDEV MCP: Prepare release environment with production data and run all updates"
```

**Release checklist automation:**
- Database migration testing
- Configuration import/export
- Performance validation

## 📝 **Command Cheat Sheet**

### **Quick DDEV Operations**
```bash
# Environment management
"Start <project name> DDEV environment"                    # ddev_start
"Get DDEV project status and URLs"               # ddev_status
"Restart DDEV with fresh containers"             # ddev_restart

# Database operations
"Import production database dump"                 # ddev_import_db
"Export current database to timestamped file"    # ddev_export_db

# Drupal operations
"Clear all Drupal caches"                        # ddev_drush cr
"Export configuration to files"                  # ddev_drush cex
"Import configuration from files"                # ddev_drush cim
"Run database updates"                           # ddev_drush updb

# Development tools
"Show DDEV container logs"                       # ddev_logs
"SSH into web container"                         # ddev_ssh
"Run Composer install"                           # ddev_composer install
```

### **DDEV Operations**
```bash
# Environment Management
"DDEV MCP: [operation]"

# Error Investigation
"DDEV MCP: [debug setup]"

# Feature Validation
"DDEV MCP: [deploy change]"
```

## 🚀 **Getting Started**

1. **Add DDEV MCP to your `~/.cursor/mcp.json`**
2. **Restart Cursor** to load the MCP server
3. **Try a simple command**: `"Use DDEV MCP to get the status of my project"`
4. **Start your project**: `"DDEV MCP: start project"`

## 💡 **Pro Tips**

- **Use specific project paths** when working with multiple DDEV projects
- **Combine operations** for efficient workflows
- **Monitor logs** during complex operations
- **Test in isolation** before complex operations
- **Use timeouts** for long-running database operations

**Your DDEV MCP server is ready to supercharge your ddev development workflow!** 🎉
