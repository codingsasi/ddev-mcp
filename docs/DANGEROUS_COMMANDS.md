# Dangerous Commands Configuration

This document explains how to configure dangerous commands in the DDEV MCP server.

## Overview

The DDEV MCP server includes a flexible system for marking tools and commands as dangerous. This allows contributors to easily add new tools with proper safety controls.

## How It Works

1. **Environment Variable**: Set `ALLOW_DANGEROUS_COMMANDS=true` to allow dangerous commands
2. **Configuration**: Dangerous commands are defined in `src/config/dangerous-commands.ts`
3. **Automatic Checking**: All tool executions are automatically checked against dangerous patterns

## Adding Dangerous Commands

### For Existing Tools

To add dangerous command patterns to an existing tool, edit `src/config/dangerous-commands.ts`:

```typescript
{
  toolName: 'ddev_platform',
  description: 'Platform.sh CLI commands that can affect production environments',
  commandParam: 'command', // Parameter name that contains the command
  dangerousPatterns: [
    /environment:delete/i,
    /environment:redeploy/i,
    // Add more patterns here
  ]
}
```

### For New Tools

When creating a new tool, add it to the dangerous commands configuration:

```typescript
{
  toolName: 'ddev_database',
  description: 'Database operations that can affect data',
  commandParam: 'action', // or whatever parameter contains the command
  dangerousPatterns: [
    /drop/i,
    /truncate/i,
    /delete.*from/i,
    /alter.*table/i
  ]
}
```

### For Entirely Dangerous Tools

If an entire tool is dangerous (all commands are dangerous):

```typescript
{
  toolName: 'ddev_destroy_project',
  description: 'Completely destroys a DDEV project and all its data',
  dangerousPatterns: [/.*/] // All commands are dangerous
}
```

## Configuration Options

### `toolName`
The name of the MCP tool (e.g., `ddev_platform`, `ddev_database`)

### `description`
Human-readable description of what makes this tool dangerous

### `commandParam`
The parameter name that contains the command to check. Common values:
- `command` - for tools that take a command parameter
- `action` - for tools that take an action parameter
- `query` - for tools that take a query parameter

### `dangerousPatterns`
Array of regular expressions that match dangerous commands. Use the `i` flag for case-insensitive matching.

## Examples

### Platform.sh Commands
```typescript
{
  toolName: 'ddev_platform',
  description: 'Platform.sh CLI commands that can affect production environments',
  commandParam: 'command',
  dangerousPatterns: [
    /environment:redeploy/i,
    /environment:delete/i,
    /backup:create/i
  ]
}
```

### Database Commands
```typescript
{
  toolName: 'ddev_database',
  description: 'Database operations that can affect data',
  commandParam: 'query',
  dangerousPatterns: [
    /drop\s+table/i,
    /truncate\s+table/i,
    /delete\s+from/i,
    /alter\s+table/i
  ]
}
```

### File Operations
```typescript
{
  toolName: 'ddev_files',
  description: 'File operations that can delete or modify important files',
  commandParam: 'operation',
  dangerousPatterns: [
    /delete/i,
    /remove/i,
    /rm\s+-rf/i
  ]
}
```

## Testing Dangerous Commands

### Test with Environment Variable Disabled (Default)
```bash
# This should be blocked
ddev_platform environment:redeploy
```

### Test with Environment Variable Enabled
```bash
export ALLOW_DANGEROUS_COMMANDS=true
# This should be allowed
ddev_platform environment:redeploy
```

## Best Practices

1. **Be Specific**: Use specific patterns rather than overly broad ones
2. **Test Thoroughly**: Test both dangerous and safe commands
3. **Document Clearly**: Provide clear descriptions of what makes commands dangerous
4. **Use Case-Insensitive**: Use the `i` flag for case-insensitive matching
5. **Consider Context**: Some commands might be safe in certain contexts

## Regular Expression Tips

- Use `^` and `$` for exact matches: `/^delete$/i`
- Use `.*` for wildcards: `/delete.*table/i`
- Escape special characters: `/drop\s+table/i`
- Use groups for alternatives: `/(delete|remove|drop)/i`
- Use word boundaries: `/\bdelete\b/i`

## Contributing

When contributing new tools or dangerous command patterns:

1. Add the configuration to `src/config/dangerous-commands.ts`
2. Test with both `ALLOW_DANGEROUS_COMMANDS=true` and `ALLOW_DANGEROUS_COMMANDS=false`
3. Update this documentation if needed
4. Add tests for the new patterns
