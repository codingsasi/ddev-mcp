# Extending DDEV MCP Server

## Adding Support for New CMS/Frameworks

The DDEV MCP Server is designed with an extensible architecture that makes it easy to add support for new CMS platforms and frameworks. Based on the [DDEV CMS Quickstarts](https://docs.ddev.com/en/stable/users/quickstart/), you can add support for any DDEV-supported project type.

## 🏗️ **Architecture Overview**

The server follows a modular pattern:

```
Core DDEV Tools (Universal)
├── Environment management (start, stop, restart)
├── Database operations (import, export)
├── Container management (logs, ssh)
└── Project information (status, describe)

CMS-Specific Extensions
├── Drupal (Drush commands)
├── WordPress (WP-CLI commands)
├── Laravel (Artisan commands) ← Example to add
├── Symfony (Console commands) ← Example to add
└── [Your CMS] ← Add here
```

## 📋 **Step-by-Step Guide**

### 1. **Add Type Definitions**

Edit `src/types/index.ts` to add your CMS-specific types:

```typescript
// Example: Adding Laravel Artisan support
export interface DDEVArtisanOptions extends DDEVCommandOptions {
  command: string;
  args?: string[];
  env?: string; // Laravel environment
  force?: boolean;
}

export interface LaravelAppInfo {
  version: string;
  environment: string;
  debugMode: boolean;
  timezone: string;
}
```

### 2. **Add Operations Methods**

Edit `src/ddev/operations.ts` to add CMS-specific methods:

```typescript
/**
 * Execute Laravel Artisan command
 */
async artisan(options: DDEVArtisanOptions): Promise<CommandResult> {
  this.logger.info('Executing Artisan command', {
    command: options.command,
    args: options.args,
    projectPath: options.projectPath
  });

  const args: string[] = [options.command];
  if (options.args) args.push(...options.args);
  if (options.env) args.push(`--env=${options.env}`);
  if (options.force) args.push('--force');

  const execOptions = {
    cwd: options.projectPath,
    timeout: options.timeout || 120000
  };

  return await this.commandExecutor.executeDDEV('exec', ['php', 'artisan', ...args], execOptions);
}

/**
 * Get Laravel application information
 */
async getLaravelAppInfo(options: DDEVCommandOptions = {}): Promise<CommandResult> {
  this.logger.info('Getting Laravel application information', { projectPath: options.projectPath });

  const execOptions = {
    cwd: options.projectPath,
    timeout: options.timeout || 60000
  };

  return await this.commandExecutor.executeDDEV('exec', ['php', 'artisan', 'about'], execOptions);
}
```

### 3. **Define MCP Tools**

Edit `src/server/tools.ts` to add tool definitions:

```typescript
// Add to DDEV_TOOLS array
{
  name: 'ddev_artisan',
  description: 'Execute Laravel Artisan commands in DDEV environment',
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: {
        type: 'string',
        description: 'Path to the DDEV project directory'
      },
      command: {
        type: 'string',
        description: 'Artisan command to execute'
      },
      args: {
        type: 'array',
        items: { type: 'string' },
        description: 'Additional arguments for the Artisan command'
      },
      env: {
        type: 'string',
        description: 'Laravel environment (local, production, etc.)'
      },
      force: {
        type: 'boolean',
        description: 'Force the operation',
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
  name: 'ddev_laravel_info',
  description: 'Get Laravel application information and environment details',
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
}
```

### 4. **Add Tool Handlers**

Edit `src/server/index.ts` to handle the new tools:

```typescript
// Add to executeToolCall method
case 'ddev_artisan':
  return await this.ddevOps.artisan(args);

case 'ddev_laravel_info':
  return await this.ddevOps.getLaravelAppInfo(args);
```

### 5. **Add Tests**

Edit `tests/server.test.ts` to include tests for your new tools:

```typescript
test('should have Laravel tools', () => {
  const expectedLaravelTools = [
    'ddev_artisan',
    'ddev_laravel_info'
  ];

  const toolNames = DDEV_TOOLS.map(tool => tool.name);
  expectedLaravelTools.forEach(expectedTool => {
    expect(toolNames).toContain(expectedTool);
  });
});

test('should validate Laravel tool arguments', () => {
  // Test valid Artisan command
  const validResult = validateToolArguments('ddev_artisan', {
    command: 'migrate'
  });
  expect(validResult.valid).toBe(true);

  // Test missing required command
  const invalidResult = validateToolArguments('ddev_artisan', {});
  expect(invalidResult.valid).toBe(false);
  expect(invalidResult.errors).toContain('Missing required field: command');
});
```

### 6. **Update Documentation**

Add your CMS examples to the README.md:

```markdown
# Laravel
"Run php artisan migrate using DDEV MCP"
"Execute artisan cache:clear via DDEV"
"Use DDEV MCP to run artisan queue:work"
```

## 🎯 **CMS-Specific Implementation Examples**

### **Laravel (Artisan)**
```typescript
// Common Laravel commands
await this.artisan({ command: 'migrate', projectPath });
await this.artisan({ command: 'cache:clear', projectPath });
await this.artisan({ command: 'make:model', args: ['User'], projectPath });
```

### **Symfony (Console)**
```typescript
// Symfony console commands
await this.symfonyConsole({ command: 'cache:clear', projectPath });
await this.symfonyConsole({ command: 'doctrine:migrations:migrate', projectPath });
```

### **TYPO3 (Console)**
```typescript
// TYPO3 console commands
await this.typo3Console({ command: 'cache:flush', projectPath });
await this.typo3Console({ command: 'extension:activate', args: ['news'], projectPath });
```

### **Magento (CLI)**
```typescript
// Magento CLI commands
await this.magentoCli({ command: 'cache:clean', projectPath });
await this.magentoCli({ command: 'module:enable', args: ['Vendor_Module'], projectPath });
```

## 🧪 **Testing Your Extension**

1. **Build and test**:
```bash
npm run build
npm test
```

2. **Manual testing**:
```bash
# Start your DDEV MCP server
node dist/index.js

# Test in Cursor with your new commands
"Use DDEV MCP to run artisan migrate"
"Get Laravel application information using DDEV MCP"
```

## 📚 **Framework-Specific Resources**

When implementing support for a new framework, reference these official CLI documentation:

- **Laravel**: [Artisan Console](https://laravel.com/docs/artisan)
- **Symfony**: [Console Component](https://symfony.com/doc/current/console.html)
- **TYPO3**: [Console Commands](https://docs.typo3.org/m/typo3/reference-coreapi/main/en-us/ApiOverview/CommandControllers/Index.html)
- **Magento**: [Command-line Interface](https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/cli/commands.html)
- **CakePHP**: [Console Commands](https://book.cakephp.org/5/en/console-commands.html)

## 🤝 **Contributing Your Extension**

Once you've added support for a new CMS:

1. **Test thoroughly** with real projects
2. **Add comprehensive documentation**
3. **Include usage examples**
4. **Submit a pull request**

Your contribution helps make the DDEV MCP Server more valuable for the entire development community!

## 💡 **Tips for Success**

- **Follow existing patterns** (Drupal/WordPress examples)
- **Use the official CLI** for each framework when possible
- **Handle errors gracefully** with proper logging
- **Validate inputs** using the tool schema
- **Test with real projects** to ensure reliability
- **Document common use cases** and examples

The architecture is designed to be extensible - adding new CMS support should be straightforward by following these patterns! 🚀
