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
    switch (toolName) {
      case 'ddev_start':
        return await this.ddevOps.start(args);
      case 'ddev_stop':
        return await this.ddevOps.stop(args);
      case 'ddev_restart':
        return await this.ddevOps.restart(args);
      case 'ddev_status':
        return await this.ddevOps.status(args);
      case 'ddev_describe':
        return await this.ddevOps.describe(args);
      case 'ddev_list':
        return await this.ddevOps.list(args);
      case 'ddev_import_db':
        return await this.ddevOps.importDB(args);
      case 'ddev_export_db':
        return await this.ddevOps.exportDB(args);
      case 'ddev_drush':
        return await this.ddevOps.drush(args);
      case 'ddev_composer':
        return await this.ddevOps.composer(args);
      case 'ddev_logs':
        return await this.ddevOps.logs(args);
      case 'ddev_ssh':
        return await this.ddevOps.ssh(args);
      case 'ddev_config':
        return await this.ddevOps.config(args);
      case 'ddev_delete':
        return await this.ddevOps.delete(args);
      case 'ddev_clean':
        return await this.ddevOps.clean(args);
      case 'ddev_snapshot':
        return await this.ddevOps.snapshot(args);
      case 'ddev_import_files':
        return await this.ddevOps.importFiles(args);
      case 'ddev_debug':
        return await this.ddevOps.debug(args);
      case 'ddev_exec':
        return await this.ddevOps.exec(args);
      case 'ddev_help':
        return await this.ddevOps.help(args);
      case 'ddev_share':
        return await this.ddevOps.share(args);
      case 'ddev_hostname':
        return await this.ddevOps.hostname(args);
      case 'ddev_poweroff':
        return await this.ddevOps.poweroff(args);
      case 'ddev_version':
        return await this.ddevOps.version(args);
      case 'ddev_go_to_project_directory':
        return await this.ddevOps.changeDirectory(args);
      case 'ddev_redis_cli':
        return await this.ddevOps.redisCli(args);
      case 'ddev_redis_info':
        return await this.ddevOps.redisInfo(args);
      case 'ddev_solr':
        return await this.ddevOps.solr(args);
      case 'ddev_solr_zk':
        return await this.ddevOps.solrZk(args);
      case 'ddev_mysql':
        return await this.ddevOps.mysql(args);
      case 'ddev_platform':
        return await this.handlePlatformCommand(args);
      case 'ddev_playwright':
        return await this.ddevOps.playwright(args);
      case 'ddev_playwright_install':
        return await this.ddevOps.playwrightInstall(args);
      case 'ddev_wp_cli':
        return await this.ddevOps.wpCli(args);
      case 'ddev_wp_site_info':
        return await this.ddevOps.getWordPressSiteInfo(args);
      case 'ddev_wp_plugin_install':
        return await this.ddevOps.installWordPressPlugin(args);
      case 'ddev_wp_plugin_toggle':
        return await this.ddevOps.toggleWordPressPlugin(args);
      case 'ddev_wp_plugin_list':
        return await this.ddevOps.listWordPressPlugins(args);
      case 'ddev_wp_theme_install':
        return await this.ddevOps.installWordPressTheme(args);
      case 'ddev_wp_theme_activate':
        return await this.ddevOps.activateWordPressTheme(args);
      case 'ddev_wp_core_update':
        return await this.ddevOps.updateWordPressCore(args);
      case 'ddev_wp_rewrite_flush':
        return await this.ddevOps.flushWordPressRewrites(args);
      case 'ddev_wp_search_replace':
        return await this.ddevOps.wordPressSearchReplace(args);
      case 'ddev_wp_plugin_manage':
        return await this.ddevOps.wpPluginManage(args);
      case 'ddev_wp_theme_manage':
        return await this.ddevOps.wpThemeManage(args);
      case 'ddev_wp_user_manage':
        return await this.ddevOps.wpUserManage(args);
      case 'ddev_wp_maintenance':
        return await this.ddevOps.wpMaintenance(args);

      // User Interaction Tools
      case 'request_user_input':
        return await this.ddevOps.requestUserInput(args);
      case 'message_complete_notification':
        return await this.ddevOps.sendNotification(args);

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${toolName}`
        );
    }
  }

  private async handlePlatformCommand(args: any): Promise<CommandResult> {
    const command = args.command || 'environment:list';

    // Check if the command is dangerous
    if (this.isDangerousPlatformCommand(command)) {
      // Use simple confirmation
      const { confirmAction } = await import('../utils/userInput.js');
      
      const confirmed = await confirmAction({
        message: `⚠️  DANGER: Platform.sh command can affect production!\n\nCommand: "${command}"\nProject: ${args.projectPath}`,
        timeout: 300, // 5 minutes for dangerous commands
        defaultYes: false
      });

      if (!confirmed) {
        return {
          success: false,
          exitCode: 1,
          output: 'Command cancelled by user',
          error: 'User did not confirm execution of dangerous Platform.sh command',
          duration: 0
        };
      }

      // Send notification about the dangerous command
      await this.ddevOps.sendNotification({
        title: 'Platform.sh Command Executing',
        message: `Executing dangerous command: ${command}`
      });
    }

    // Execute the platform command
    return await this.ddevOps.platform(args);
  }

  private isDangerousPlatformCommand(command: string): boolean {
    const dangerousPatterns = [
      // Environment operations that can affect production
      /environment:delete/i,
      /environment:deploy/i,
      /environment:redeploy/i,
      /environment:merge/i,
      /environment:pause/i,
      /environment:push/i,
      /environment:resume/i,
      /environment:synchronize/i,
      /environment:activate/i,
      /environment:branch/i,
      /environment:checkout/i,

      // Backup operations
      /backup:create/i,
      /backup:delete/i,
      /backup:restore/i,

      // Database operations
      /db:dump/i,
      /db:sql/i,

      // Domain operations
      /domain:add/i,
      /domain:delete/i,
      /domain:update/i,

      // Certificate operations
      /certificate:add/i,
      /certificate:delete/i,

      // Project operations
      /project:delete/i,
      /project:create/i,

      // User management
      /user:add/i,
      /user:delete/i,
      /user:update/i,

      // Variable operations
      /variable:create/i,
      /variable:delete/i,
      /variable:update/i,

      // Integration operations
      /integration:add/i,
      /integration:delete/i,
      /integration:update/i,

      // Organization operations
      /organization:create/i,
      /organization:delete/i,
      /organization:billing:address/i,
      /organization:billing:profile/i,

      // Team operations
      /team:create/i,
      /team:delete/i,
      /team:update/i,
      /team:project:add/i,
      /team:project:delete/i,
      /team:user:add/i,
      /team:user:delete/i,

      // Service operations
      /service:mongo:dump/i,
      /service:mongo:restore/i,

      // SSH operations to production environments
      /ssh.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*ssh/i,
      /scp.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*scp/i,

      // Drush operations on production environments
      /drush.*-e(prod|production|master|main)/i,
      /-e(prod|production|master|main).*drush/i,
      /environment:drush.*-e(prod|production|master|main)/i,

      // Mount operations
      /mount:download/i,
      /mount:upload/i,

      // Operation execution
      /operation:run/i,

      // Source operations
      /source-operation:run/i,

      // General dangerous patterns
      /redeploy/i,
      /delete/i,
      /remove/i,
      /destroy/i,
      /wipe/i,
      /clear.*cache/i,
      /project:clear-build-cache/i
    ];

    return dangerousPatterns.some(pattern => pattern.test(command));
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
