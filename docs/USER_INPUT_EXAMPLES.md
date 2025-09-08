# DDEV MCP User Input System - Usage Examples

This document shows how to use the simple user input system in any DDEV tool. The system provides one main function for yes/no confirmations.

## Available Function

### `confirmAction()` - Yes/No Confirmations
Perfect for dangerous operations, deletions, or any action that needs explicit user confirmation.

## Import the Function

```typescript
import { confirmAction } from '../utils/userInput.js';
```

## Usage Examples

### Example 1: Database Deletion Confirmation

```typescript
// In your DDEV tool handler
private async handleDatabaseDeletion(args: any): Promise<CommandResult> {
  const confirmed = await confirmAction({
    message: `⚠️  DANGER: This will permanently delete the database!\n\nProject: ${args.projectPath}\nDatabase: ${args.databaseName}`,
    timeout: 120, // 2 minutes
    defaultYes: false
  });

  if (!confirmed) {
    return {
      success: false,
      output: 'Database deletion cancelled by user',
      error: 'User did not confirm database deletion'
    };
  }

  // Proceed with database deletion
  return await this.ddevOps.deleteDatabase(args);
}
```

### Example 2: Platform.sh Redeploy Confirmation

```typescript
// In your DDEV tool handler
private async handlePlatformRedeploy(args: any): Promise<CommandResult> {
  const confirmed = await confirmAction({
    message: `⚠️  DANGER: This will redeploy the environment!\n\nCommand: "environment:redeploy"\nProject: ${args.projectPath}`,
    timeout: 300, // 5 minutes
    defaultYes: false
  });

  if (!confirmed) {
    return {
      success: false,
      output: 'Redeploy cancelled by user',
      error: 'User did not confirm redeploy'
    };
  }

  // Proceed with redeploy
  return await this.ddevOps.platform(args);
}
```

### Example 3: Cache Clear Confirmation

```typescript
// In your DDEV tool handler
private async handleCacheClear(args: any): Promise<CommandResult> {
  const confirmed = await confirmAction({
    message: `This will clear all caches for project: ${args.projectPath}`,
    timeout: 60,
    defaultYes: false
  });

  if (!confirmed) {
    return {
      success: false,
      output: 'Cache clear cancelled by user'
    };
  }

  // Proceed with cache clear
  return await this.ddevOps.clearCache(args);
}
```

## Function Parameters

### `confirmAction(options: ConfirmationOptions): Promise<boolean>`

**Parameters:**
- `message: string` - The warning/confirmation message to display
- `timeout?: number` - Timeout in seconds (default: 60)
- `defaultYes?: boolean` - Default value if timeout occurs (default: false)

**Returns:**
- `boolean` - `true` if user confirmed, `false` if cancelled or timeout

## Integration Patterns

### Pattern 1: Simple Confirmation
```typescript
const confirmed = await confirmAction({
  message: 'Are you sure you want to proceed?',
  timeout: 60
});
```

### Pattern 2: Dangerous Operation
```typescript
const confirmed = await confirmAction({
  message: '⚠️  DANGER: This operation cannot be undone!',
  timeout: 120,
  defaultYes: false
});
```

### Pattern 3: Quick Confirmation
```typescript
const confirmed = await confirmAction({
  message: 'Continue with operation?',
  timeout: 30,
  defaultYes: true
});
```

## Error Handling

The function always returns a boolean, making error handling simple:

```typescript
const confirmed = await confirmAction({ message: 'Proceed?' });
if (!confirmed) {
  return { success: false, output: 'Operation cancelled' };
}
```

## Tool Integration Example

Here's how to integrate user input into a new DDEV tool:

```typescript
// In src/server/tools.ts - Add your tool definition
{
  name: 'ddev_custom_operation',
  description: 'Perform custom operation with user confirmation',
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: { type: 'string', description: 'Path to DDEV project' },
      operation: { type: 'string', description: 'Operation to perform' }
    },
    required: ['projectPath']
  }
}

// In src/server/index.ts - Add your tool handler
case 'ddev_custom_operation':
  return await this.handleCustomOperation(args);

// Add your handler method
private async handleCustomOperation(args: any): Promise<CommandResult> {
  const { confirmAction } = await import('../utils/userInput.js');
  
  const confirmed = await confirmAction({
    message: `⚠️  Custom operation: ${args.operation}\n\nProject: ${args.projectPath}`,
    timeout: 120
  });

  if (!confirmed) {
    return { success: false, output: 'Operation cancelled by user' };
  }

  // Execute your custom operation
  return await this.ddevOps.customOperation(args);
}
```

## Best Practices

1. **Always provide clear messages** - Explain what will happen
2. **Use appropriate timeouts** - Longer for dangerous operations
3. **Handle cancellation gracefully** - Always check return values
4. **Provide context** - Include project path, command details, etc.
5. **Use appropriate defaults** - `defaultYes: false` for dangerous operations

This simple approach makes it easy to add user confirmation to any DDEV tool with just a few lines of code!