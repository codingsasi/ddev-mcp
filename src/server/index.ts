/**
 * DDEV MCP Server
 * Production-ready MCP server implementation for DDEV automation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

import { DDEVOperations } from '../ddev/operations.js';
import { Logger, LogLevel } from '../utils/logger.js';
import { DDEV_TOOLS, validateToolArguments } from './tools.js';
import { CommandResult } from '../types/index.js';
import { checkDangerousCommand, createBlockedCommandResult, areDangerousCommandsAllowed } from '../utils/dangerous-commands.js';

export class DDEVMCPServer {
  private server: Server;
  private ddevOps: DDEVOperations;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('DDEVMCPServer', LogLevel.WARN);
    this.ddevOps = new DDEVOperations(this.logger.child('DDEVOperations'));

    // Initialize MCP Server with metadata
    this.server = new Server(
      {
        name: 'ddev-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupRequestHandlers();
  }

  private setupRequestHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: DDEV_TOOLS.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args = {} } = request.params;

      try {
        // Validate arguments
        const validation = validateToolArguments(name, args);
        if (!validation.valid) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid arguments: ${validation.errors?.join(', ')}`
          );
        }

        // Execute the tool
        const result = await this.executeToolCall(name, args);

        return {
          content: [
            {
              type: 'text',
              text: this.formatToolResult(name, result)
            }
          ]
        };

      } catch (error) {
        this.logger.error('Tool call failed', {
          tool: name,
          error: error instanceof Error ? error.message : String(error)
        });

        if (error instanceof McpError) {
          throw error;
        }

        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async executeToolCall(toolName: string, args: any): Promise<CommandResult> {
    // Get timeout from environment variable, default to 120 seconds (2 minutes)
    const timeoutMs = parseInt(process.env.DDEV_MCP_TOOL_TIMEOUT || '120000', 10);

    const timeoutPromise = new Promise<CommandResult>((_, reject) => {
      setTimeout(() => reject(new Error(`Tool execution timeout after ${timeoutMs}ms`)), timeoutMs);
    });

    const toolExecution = this.executeTool(toolName, args);
    return await Promise.race([toolExecution, timeoutPromise]);
  }

  private async executeTool(toolName: string, args: any): Promise<CommandResult> {
    // Check if this tool execution is dangerous
    const dangerousCheck = checkDangerousCommand(toolName, args);

    if (dangerousCheck.isDangerous && !areDangerousCommandsAllowed()) {
      return createBlockedCommandResult(
        toolName,
        dangerousCheck.command,
        args.projectPath || 'unknown',
        dangerousCheck.config?.description || 'This command can affect production'
      );
    }

    switch (toolName) {
      case 'ddev_start':
        return await this.ddevOps.start(args);
      case 'ddev_stop':
        return await this.ddevOps.stop(args);
      case 'ddev_restart':
        return await this.ddevOps.restart(args);
      case 'ddev_describe':
        return await this.ddevOps.describe(args);
      case 'ddev_list':
        return await this.ddevOps.list(args);
      case 'ddev_logs':
        return await this.ddevOps.logs(args);

      // Database Operations
      case 'ddev_import_db':
        return await this.ddevOps.importDB(args);
      case 'ddev_export_db':
        return await this.ddevOps.exportDB(args);
      case 'ddev_snapshot':
        return await this.ddevOps.snapshot(args);

      // Universal Command Executor (PRIMARY TOOL)
      case 'ddev_exec':
        return await this.ddevOps.exec(args);

      // Utilities
      case 'ddev_poweroff':
        return await this.ddevOps.poweroff(args);
      case 'ddev_version':
        return await this.ddevOps.version(args);

      // User Interaction Tools
      case 'message_complete_notification':
        return await this.ddevOps.sendNotification(args);

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${toolName}`
        );
    }
  }




  private formatToolResult(toolName: string, result: CommandResult): string {
    const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
    const duration = `${result.duration}ms`;

    let output = `${status} - ${toolName} (${duration})\n\n`;

    if (result.success && result.output) {
      output += `Output:\n${result.output}`;
    }

    if (!result.success && result.error) {
      output += `Error (exit code ${result.exitCode}):\n${result.error}`;
    }

    return output;
  }

  async start(): Promise<void> {
    // Check if DDEV is available before starting
    const isAvailable = await this.ddevOps.checkAvailability();
    if (!isAvailable) {
      this.logger.warn('DDEV is not available or not installed');
    }

    const transport = new StdioServerTransport();

    try {
      await this.server.connect(transport);
      this.logger.info('DDEV MCP Server started successfully', {
        ddevAvailable: isAvailable,
        toolsCount: DDEV_TOOLS.length,
        client: 'PhpStorm/Cursor MCP Client'
      });
    } catch (error) {
      this.logger.error('Failed to start MCP server', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping DDEV MCP Server');
    await this.server.close();
  }
}

// Export for external usage
export { DDEV_TOOLS } from './tools.js';
export { DDEVOperations } from '../ddev/operations.js';
