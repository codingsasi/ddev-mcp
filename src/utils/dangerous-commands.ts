/**
 * Dangerous Commands Utility
 *
 * Provides utilities for checking and handling dangerous commands
 */

import { getDangerousConfig, isCommandDangerous } from '../config/dangerous-commands.js';
import { CommandResult } from '../types/index.js';

export interface DangerousCommandCheck {
  isDangerous: boolean;
  toolName: string;
  command: string;
  config?: {
    description: string;
    commandParam: string;
  };
}

/**
 * Check if a tool execution is dangerous
 */
export function checkDangerousCommand(toolName: string, args: any): DangerousCommandCheck {
  const config = getDangerousConfig(toolName);

  if (!config) {
    return {
      isDangerous: false,
      toolName,
      command: ''
    };
  }

  // Get the command from the appropriate parameter
  const commandParam = config.commandParam || 'command';
  const command = args[commandParam] || '';

  return {
    isDangerous: isCommandDangerous(toolName, command),
    toolName,
    command,
    config: {
      description: config.description,
      commandParam
    }
  };
}

/**
 * Create a blocked command result for dangerous commands
 */
export function createBlockedCommandResult(
  toolName: string,
  command: string,
  projectPath: string,
  configDescription: string
): CommandResult {
  return {
    success: false,
    exitCode: 1,
    output: `⚠️  DANGER: ${configDescription}\n\nTool: ${toolName}\nCommand: "${command}"\nProject: ${projectPath}\n\nThis command is blocked for safety. Set ALLOW_DANGEROUS_COMMANDS=true to allow dangerous commands.\n\nSee https://github.com/codingsasi/ddev-mcp for more information on dangerous commands.`,
    error: 'Dangerous command blocked for safety',
    duration: 0
  };
}

/**
 * Check if dangerous commands are allowed via environment variable
 */
export function areDangerousCommandsAllowed(): boolean {
  return process.env.ALLOW_DANGEROUS_COMMANDS === 'true';
}
