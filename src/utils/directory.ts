/**
 * Directory utilities for DDEV MCP Server
 * Simple approach - just use the current working directory
 */

import { Logger } from './logger.js';
import { CommandExecutor } from './command.js';

/**
 * Get the current working directory synchronously using pwd command
 * @param logger Optional logger instance
 * @returns Current working directory path
 */
export async function getCurrentWorkingDirectorySync(logger?: Logger): Promise<string> {
  const log = logger || new Logger('DirectoryUtils');
  const executor = new CommandExecutor(log);
  const cwd = await executor.pwd();

  log.debug('Using current working directory from pwd', { cwd });
  return cwd;
}

/**
 * Get the current working directory asynchronously using pwd command
 * @param logger Optional logger instance
 * @returns Promise resolving to current working directory path
 */
export async function getCurrentWorkingDirectory(logger?: Logger): Promise<string> {
  return getCurrentWorkingDirectorySync(logger);
}

/**
 * Resolve working directory - just returns the provided path or current directory
 * @param providedPath Optional path to use
 * @param logger Optional logger instance
 * @returns Resolved directory path
 */
export async function resolveWorkingDirectory(providedPath?: string, logger?: Logger): Promise<string> {
  const log = logger || new Logger('DirectoryUtils');
  const resolved = providedPath || await getCurrentWorkingDirectorySync(logger);

  log.debug('Resolved working directory', { providedPath, resolved });
  return resolved;
}

/**
 * Resolve working directory synchronously
 * @param providedPath Optional path to use
 * @param logger Optional logger instance
 * @returns Resolved directory path
 */
export async function resolveWorkingDirectorySync(providedPath?: string, logger?: Logger): Promise<string> {
  const log = logger || new Logger('DirectoryUtils');
  const resolved = providedPath || await getCurrentWorkingDirectorySync(logger);

  log.debug('Resolved working directory (sync)', { providedPath, resolved });
  return resolved;
}