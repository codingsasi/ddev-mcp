# Dangerous Command Protection

The DDEV MCP server includes built-in protection against dangerous commands that could affect production environments or cause data loss.

## Overview

By default, certain commands that could have destructive effects are **blocked** unless explicitly enabled. This prevents accidental execution of commands that could:

- Delete production data
- Redeploy production environments
- Remove important files
- Modify production configurations
- Execute destructive database operations

## How It Works

When you execute a command via `ddev_exec` or other tools, the server:

1. **Checks the command** against a list of dangerous command patterns
2. **Blocks execution** if the command matches and `ALLOW_DANGEROUS_COMMANDS` is not set to `true`
3. **Returns a clear error message** explaining why the command was blocked and how to enable it if needed

## Enabling Dangerous Commands

MCP Configuration (Example for Cursor)

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ddev": {
      "command": "npx",
      "args": ["ddev-mcp"],
      "env": {
        "ALLOW_DANGEROUS_COMMANDS": "true"
      }
    }
  }
}
```

**⚠️ Warning**: Only enable dangerous commands when you understand the risks and are working in a safe environment.

## Protected Commands

### Platform.sh Commands

These commands can affect production environments and are blocked by default:

- `environment:delete` - Deletes an environment
- `environment:redeploy` - Redeploys an environment
- `domain:delete` - Deletes a domain
- `db:dump` (with production flags) - Can affect production
- `environment:push` - Pushes code to production
- `project:delete` - Deletes entire project

**Example blocked command:**
```javascript
// This will be BLOCKED
{
  name: 'ddev_exec',
  arguments: {
    command: 'platform environment:redeploy -e master',
    projectPath: '/path/to/project'
  }
}
```

**Error message:**
```
🚫 BLOCKED - Dangerous Command Detected

Tool: ddev_exec
Command: platform environment:redeploy -e master
Project: /path/to/project

Reason: Platform.sh production deployment commands are restricted

This command could affect production environments. If you're certain you want to run this:

1. Set environment variable: export ALLOW_DANGEROUS_COMMANDS="true"
2. Or add to ~/.cursor/mcp.json:
   "env": {
     "ALLOW_DANGEROUS_COMMANDS": "true"
   }

⚠️  Only enable dangerous commands when you understand the risks!
```

## Adding New Dangerous Command Patterns

Developers can add new dangerous command patterns in `src/config/dangerous-commands.ts`:

```typescript
export const DANGEROUS_COMMANDS: DangerousCommandConfig[] = [
  {
    tool: 'ddev_exec',
    patterns: [
      /platform\s+environment:(redeploy|delete|push)/i,
      /platform\s+domain:delete/i,
      /platform\s+project:delete/i,
    ],
    description: 'Platform.sh production deployment commands are restricted'
  },
  {
    tool: 'ddev_exec',
    patterns: [
      /rm\s+-rf/i,
      /rm\s+-f.*\/important-dir/i,
    ],
    description: 'File deletion commands are restricted'
  },
  // Add your own patterns here
];
```

### Pattern Syntax

Use regular expressions to match dangerous commands:

- `/pattern/i` - Case-insensitive matching
- `\s+` - Match whitespace
- `(option1|option2)` - Match either option
- `.*` - Match any characters

## Testing

Test dangerous command protection:

```bash
# This should be blocked
node -e "import('@modelcontextprotocol/sdk/client/index.js').then(async ({Client})=>{const {StdioClientTransport}=await import('@modelcontextprotocol/sdk/client/stdio.js');const c=new Client({name:'test',version:'1.0.0'},{});await c.connect(new StdioClientTransport({command:'node',args:['dist/index.js']}));const r=await c.callTool({name:'ddev_exec',arguments:{command:'platform environment:redeploy -e master',projectPath:'/tmp'}});console.log(JSON.stringify(r,null,2));await c.close();})"

# This should succeed with ALLOW_DANGEROUS_COMMANDS=true
ALLOW_DANGEROUS_COMMANDS=true node -e "..." # (same command as above)
```

## Implementation Details

The dangerous command protection system:

1. **Location**: `src/utils/dangerous-commands.ts` and `src/config/dangerous-commands.ts`
2. **Execution**: Checks run before any command execution
3. **Response**: Returns formatted error message instead of executing command
4. **Bypass**: Only via `ALLOW_DANGEROUS_COMMANDS=true` environment variable
5. **Tools affected**: Primarily `ddev_exec`, but can be applied to any tool

## FAQ

**Q: Why are commands blocked by default?**
A: To prevent accidental execution of destructive commands, especially in AI-assisted workflows where commands might be suggested automatically.

**Q: Can I permanently enable dangerous commands?**
A: Yes, via MCP configuration or shell profile, but it's not recommended for security reasons.

**Q: What if I need to run a blocked command regularly?**
A: Consider if there's a safer alternative, or create a specific workflow with dangerous commands enabled only for that task.

**Q: How do I know if a command is dangerous?**
A: The system will block it and provide a clear error message. You can also check `src/config/dangerous-commands.ts` for the full list.

**Q: Can I remove dangerous command protection entirely?**
A: Yes, by always setting `ALLOW_DANGEROUS_COMMANDS=true`, but this removes an important safety feature.

## Related Documentation

- [`README.md`](../README.md) - General DDEV MCP documentation
- `src/config/dangerous-commands.ts` - Full list of dangerous command patterns
- `src/utils/dangerous-commands.ts` - Implementation details
