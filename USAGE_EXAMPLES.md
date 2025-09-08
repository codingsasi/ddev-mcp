# DDEV MCP Server Usage Examples

## 🎯 **Real-World ddev Development Scenarios**

Based on your successful Playwright MCP experience, here are practical examples of how DDEV MCP integrates with your workflow.

### **🌅 Morning Development Startup**

```bash
# Combined DDEV + Playwright workflow
"Use DDEV MCP to start ddev environment and import latest production database, then use Playwright MCP to verify the homepage loads correctly"
```

**What happens:**
1. DDEV MCP: `ddev start` in the project directory
2. DDEV MCP: `ddev import-db --src=/path/to/latest-prod-dump.sql.gz`
3. Playwright MCP: Navigate to `https://myproject.ddev.site`
4. Playwright MCP: Take screenshot and verify page elements

### **🔧 Feature Development Cycle**

```bash
# Enable new module and test
"DDEV MCP: Enable the new custom module and clear Drupal cache, then Playwright MCP: test the dashboard workflow"
```

**DDEV MCP commands:**
- `ddev drush en <module_name> -y`
- `ddev drush cr`

**Playwright MCP commands:**
- Navigate to custom dashboard
- Test user interactions
- Capture screenshots of new features

### **🐛 Bug Investigation Workflow**

```bash
# Debug mode + error reproduction
"DDEV MCP: Enable Xdebug and tail error logs, then Playwright MCP: reproduce the login bug and show me the exact error state"
```

**DDEV MCP sequence:**
1. `ddev ssh` to enable Xdebug
2. `ddev logs --follow --tail=50`
3. Monitor for errors during reproduction

**Playwright MCP sequence:**
1. Navigate to login page
2. Fill form with problematic credentials
3. Capture error state and network requests

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
"DDEV MCP: Build custom theme assets and restart services, then Playwright MCP: take before/after screenshots of the homepage"
```

**DDEV MCP commands:**
- `ddev ssh "cd themes/custom && npm run build"`
- `ddev restart`

**Playwright MCP commands:**
- Screenshot comparison workflow
- Test responsive breakpoints

### **🧪 Test Environment Setup**

```bash
# Fresh test environment
"DDEV MCP: Create clean test environment with test users, then Playwright MCP: run the complete test suite"
```

**DDEV MCP preparation:**
```bash
ddev import-db --src=clean-test-db.sql
ddev drush user:create testuser --mail=test@example.com --password=testpass  # Create test user
ddev drush cr
```

**Playwright MCP execution:**
- Run existing test suite from `test/playwright/tests/feature.spec.ts`
- Generate test reports

## 🎭 **Advanced Combined Workflows**

### **Performance Testing Pipeline**

```bash
"DDEV MCP: Configure for performance testing with production-like settings, then Playwright MCP: run Lighthouse audits on key <project name> pages"
```

**DDEV MCP setup:**
- Disable Xdebug: `ddev ssh "sudo phpdismod xdebug"`
- Enable production caching
- Import large dataset

**Playwright MCP testing:**
- Lighthouse performance audits
- Core Web Vitals measurement
- Mobile vs desktop comparisons

### **Continuous Integration Simulation**

```bash
"DDEV MCP: Run the complete CI pipeline locally - fresh DB, run updates, build assets, then Playwright MCP: execute full regression test suite"
```

**Full CI simulation:**
1. **DDEV MCP**: Fresh environment setup
2. **DDEV MCP**: Database import and updates
3. **DDEV MCP**: Asset building
4. **Playwright MCP**: Comprehensive testing
5. **DDEV MCP**: Log collection and cleanup

### **Release Preparation**

```bash
"DDEV MCP: Prepare release environment with production data and run all updates, then Playwright MCP: verify all critical user journeys work correctly"
```

**Release checklist automation:**
- Database migration testing
- Configuration import/export
- Critical path testing
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

### **Integration with Playwright MCP**
```bash
# Environment + Testing
"DDEV MCP: [operation] then Playwright MCP: [test]"

# Error Investigation
"DDEV MCP: [debug setup] then Playwright MCP: [reproduce issue]"

# Feature Validation
"DDEV MCP: [deploy change] then Playwright MCP: [verify functionality]"
```

## 🚀 **Getting Started**

1. **Ensure your Playwright MCP is working** (you already have this!)
2. **Add DDEV MCP to your `~/.cursor/mcp.json`**
3. **Restart Cursor** to load both MCP servers
4. **Try a simple command**: `"Use DDEV MCP to get the status of my project"`
5. **Combine with Playwright**: `"DDEV MCP: start project, then Playwright MCP: take screenshot"`

## 💡 **Pro Tips**

- **Use specific project paths** when working with multiple DDEV projects
- **Combine operations** for efficient workflows
- **Monitor logs** during complex operations
- **Test in isolation** before combining with Playwright MCP
- **Use timeouts** for long-running database operations

**Your DDEV MCP server is ready to supercharge your ddev development workflow!** 🎉
