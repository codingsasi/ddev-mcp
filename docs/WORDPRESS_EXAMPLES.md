# WordPress Development with DDEV MCP Server

## 🎯 **WordPress-Specific Workflows**

Your DDEV MCP server now includes comprehensive WordPress support through WP-CLI integration. Here are practical examples for WordPress development workflows.

### **🌅 WordPress Project Setup**

```bash
# Start WordPress DDEV environment
"Use DDEV MCP to start WordPress project and get site information"
```

**What happens:**
1. DDEV MCP: `ddev start` in WordPress project directory
2. DDEV MCP: `ddev wp core version --extra` to get WordPress info
3. Returns WordPress version, PHP version, database info

### **🔌 Plugin Management**

#### **Install and Activate Plugins**
```bash
# Essential WordPress plugins
"DDEV MCP: Install and activate Akismet, Yoast SEO, and WooCommerce plugins"
```

**Individual plugin operations:**
```bash
# Install specific plugin
"Use DDEV MCP to install the Contact Form 7 plugin"

# Install and activate immediately
"DDEV MCP: Install and activate the Advanced Custom Fields plugin"

# Install specific version
"Install WordPress plugin 'woocommerce' version 8.0.0 using DDEV MCP"
```

#### **Plugin Management**
```bash
# List all plugins
"Show me all WordPress plugins in my DDEV site"

# List only active plugins
"DDEV MCP: List all active WordPress plugins"

# Deactivate plugin
"Deactivate the Hello Dolly plugin using DDEV MCP"

# Activate plugin
"DDEV MCP: Activate the Akismet plugin"
```

### **🎨 Theme Management**

```bash
# Install and activate theme
"DDEV MCP: Install and activate the Twenty Twenty-Four theme"

# Install theme without activating
"Install WordPress theme 'astra' but don't activate it yet"

# Activate existing theme
"Use DDEV MCP to activate the Storefront theme"

# Install custom theme from ZIP
"DDEV MCP: Install theme from https://example.com/custom-theme.zip and activate it"
```

### **🔄 WordPress Core Management**

```bash
# Update to latest version
"Update WordPress core to the latest version using DDEV MCP"

# Update to specific version
"DDEV MCP: Update WordPress core to version 6.4.0"

# Force update (if needed)
"Force update WordPress core using DDEV MCP even if already up to date"

# Check current version
"Get WordPress version information from my DDEV site"
```

### **🔍 Database Search and Replace**

#### **Domain Migration**
```bash
# Production to local
"DDEV MCP: Replace 'https://example.com' with 'https://example.ddev.site' in WordPress database"

# Dry run first
"Perform dry run search/replace from 'https://old-domain.com' to 'https://new-domain.com' using DDEV MCP"

# Skip specific columns
"DDEV MCP: Search replace URLs but skip the 'guid' column in WordPress database"
```

#### **Development Workflows**
```bash
# After importing production database
"DDEV MCP: Import production database, then replace production URLs with local DDEV URLs"

# SSL to non-SSL conversion
"Replace 'https://' with 'http://' in WordPress database using DDEV MCP"
```

### **🛠️ WordPress Maintenance**

```bash
# Flush rewrite rules
"DDEV MCP: Flush WordPress rewrite rules to fix permalink issues"

# General WP-CLI commands
"Use DDEV MCP to run 'wp cache flush' command"

# User management
"DDEV MCP: Execute 'wp user list --role=administrator' command"

# Media regeneration
"Run 'wp media regenerate' using DDEV MCP to rebuild thumbnails"
```

## 🎭 **Advanced WordPress Workflows**

### **E-commerce Site Setup**
```bash
"DDEV MCP: Install and activate WooCommerce and run setup wizard"
```

**Detailed workflow:**
1. **DDEV MCP**: Install WooCommerce plugin
2. **DDEV MCP**: Activate WooCommerce
3. **DDEV MCP**: Run WooCommerce setup wizard via WP-CLI

### **Content Migration Workflow**
```bash
"DDEV MCP: Import production database and update URLs"
```

**Migration validation:**
1. **DDEV MCP**: Import production database
2. **DDEV MCP**: Search/replace production URLs with local URLs
3. **DDEV MCP**: Flush rewrite rules

### **Plugin Development Workflow**
```bash
"DDEV MCP: Activate my custom plugin and flush rewrites"
```

### **Performance Optimization**
```bash
"DDEV MCP: Install caching plugins and optimize database"
```

## 📝 **WordPress Command Cheat Sheet**

### **Quick WordPress Operations**
```bash
# Site Information
"Get WordPress site information"                    # ddev_wp_site_info

# Plugin Operations
"Install WordPress plugin [plugin-name]"            # ddev_wp_plugin_install
"Activate WordPress plugin [plugin-name]"           # ddev_wp_plugin_toggle
"List all WordPress plugins"                        # ddev_wp_plugin_list
"Deactivate WordPress plugin [plugin-name]"         # ddev_wp_plugin_toggle

# Theme Operations
"Install WordPress theme [theme-name]"              # ddev_wp_theme_install
"Activate WordPress theme [theme-name]"             # ddev_wp_theme_activate

# Core Operations
"Update WordPress core"                             # ddev_wp_core_update
"Flush WordPress rewrite rules"                     # ddev_wp_rewrite_flush

# Database Operations
"Search replace [old-url] with [new-url]"          # ddev_wp_search_replace

# General WP-CLI
"Run WP-CLI command [command]"                      # ddev_wp_cli
```

### **Advanced WordPress Operations**
```bash
# Multisite management
"DDEV MCP: Run 'wp site list' to show all multisite installations"

# Database optimization
"DDEV MCP: Execute 'wp db optimize' to optimize WordPress database"

# User management
"DDEV MCP: Create admin user with 'wp user create admin admin@example.com --role=administrator'"

# Content management
"DDEV MCP: Import WordPress content from 'wp import content.xml'"

# Security hardening
"DDEV MCP: Run security checks with 'wp security scan'"
```

## 🚀 **WordPress Project Types**

### **Blog/Content Site**
- Plugin management for SEO, caching, security
- Content import/export workflows
- Theme customization testing

### **E-commerce (WooCommerce)**
- WooCommerce setup and configuration
- Payment gateway testing
- Product catalog management

### **Membership Site**
- User role management
- Membership plugin configuration
- Access control testing

### **Multisite Network**
- Network administration commands
- Site creation and management
- Plugin/theme network activation

### **Custom Development**
- Custom plugin development and testing
- Theme development workflows
- API endpoint testing

## 💡 **WordPress Best Practices with DDEV MCP**

### **Development Workflow**
1. **Start Environment**: `"DDEV MCP: Start WordPress project"`
2. **Get Site Info**: `"DDEV MCP: Get WordPress site information"`
3. **Install Dependencies**: `"DDEV MCP: Install required plugins"`
4. **Database Updates**: `"DDEV MCP: Search/replace URLs if needed"`

### **Plugin Testing**
1. **Clean Environment**: Fresh DDEV start
2. **Install Plugin**: Via DDEV MCP
3. **Activate Plugin**: Via DDEV MCP
4. **Check for Conflicts**: Test with other plugins

### **Theme Development**
1. **Install Base Theme**: Via DDEV MCP
2. **Activate Theme**: Via DDEV MCP

**Your DDEV MCP server now supports both Drupal AND WordPress development workflows!** 🎉
