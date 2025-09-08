#!/usr/bin/env node

/**
 * DDEV MCP Server Entry Point
 * Command-line interface and server startup
 */

import { DDEVMCPServer } from './server/index.js';
import { Logger, LogLevel } from './utils/logger.js';
import { getCurrentWorkingDirectorySync } from './utils/directory.js';

const logger = new Logger('Main');

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const showHelp = args.includes('--help') || args.includes('-h');
  const showVersion = args.includes('--version') || args.includes('-v');
  const verbose = args.includes('--verbose') || args.includes('--debug');

  if (showHelp) {
    console.log(`
DDEV MCP Server - Model Context Protocol server for DDEV development environments

Supports all DDEV project types: Drupal, WordPress, Laravel, Symfony, TYPO3,
CakePHP, Magento, and many more!

Usage: ddev-mcp [options]

Options:
  -h, --help      Show this help message
  -v, --version   Show version information
  --verbose       Enable verbose logging
  --debug         Enable debug logging

Environment Variables:
  DDEV_MCP_LOG_LEVEL    Set log level (DEBUG, INFO, WARN, ERROR)
  DDEV_PROJECT_PATH     Default project path for DDEV operations

Examples:
  # Start the MCP server (typically called by MCP client)
  ddev-mcp

  # Run with verbose logging
  ddev-mcp --verbose

  # Show available tools (for debugging)
  ddev-mcp --help

Supported Frameworks: Drupal, WordPress, Laravel, Symfony, TYPO3, Magento,
CakePHP, Craft CMS, and all other DDEV-supported project types.

For more information, visit: https://github.com/codingsasi/ddev-mcp
`);
    process.exit(0);
  }

  if (showVersion) {
    console.log(`ddev-mcp v1.0.0`);
    process.exit(0);
  }

  // Configure logging
  const logLevel = verbose
    ? LogLevel.DEBUG
    : process.env.DDEV_MCP_LOG_LEVEL
      ? LogLevel[process.env.DDEV_MCP_LOG_LEVEL as keyof typeof LogLevel] || LogLevel.WARN
      : LogLevel.WARN;

  const mainLogger = new Logger('Main', logLevel);

  try {
    const workingDirectory = await getCurrentWorkingDirectorySync(mainLogger);

    mainLogger.info('Starting DDEV MCP Server', {
      version: '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      logLevel: LogLevel[logLevel],
      workingDirectory
    });

    // Create and start the server
    const server = new DDEVMCPServer();

    // Handle graceful shutdown
    const shutdown = async (signal: string) => {
      mainLogger.info(`Received ${signal}, shutting down gracefully...`);
      try {
        await server.stop();
        mainLogger.info('Server stopped successfully');
        process.exit(0);
      } catch (error) {
        mainLogger.error('Error during shutdown', { error });
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGQUIT', () => shutdown('SIGQUIT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      // Don't exit on EPIPE errors (common with STDIO connections)
      if ('code' in error && error.code === 'EPIPE') {
        mainLogger.warn('Connection closed (EPIPE)', { error: error.message });
        return;
      }
      mainLogger.error('Uncaught exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      // Don't exit on EPIPE errors
      if (reason && typeof reason === 'object' && 'code' in reason && reason.code === 'EPIPE') {
        mainLogger.warn('Connection closed (EPIPE)', { reason });
        return;
      }
      mainLogger.error('Unhandled rejection', { reason, promise });
      process.exit(1);
    });

    // Start the server
    await server.start();

  } catch (error) {
    mainLogger.error('Failed to start server', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
