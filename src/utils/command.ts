/**
 * Command execution utilities for DDEV MCP Server
 * Handles safe execution of shell commands with proper error handling
 */

import { exec, execSync, spawn } from 'child_process';
import { promisify } from 'util';
import { CommandResult } from '../types/index.js';
import { Logger } from './logger.js';

const execAsync = promisify(exec);

export interface ExecOptions {
  cwd?: string;
  timeout?: number;
  maxBuffer?: number;
  env?: Record<string, string>;
}

export class CommandExecutor {
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || new Logger('CommandExecutor');
  }

  /**
   * Execute a command asynchronously
   */
  async execute(command: string, options: ExecOptions = {}): Promise<CommandResult> {
    const startTime = Date.now();

    this.logger.debug('Executing command', {
      command: this.sanitizeCommand(command),
      options: this.sanitizeOptions(options)
    });

    try {
      const workingDir = options.cwd || await this.pwd();

      // For DDEV commands, we need to preserve symlinks by using cd && command
      let finalCommand = command;
      let finalOptions: any = {
        timeout: options.timeout || 30000,
        maxBuffer: options.maxBuffer || 1024 * 1024,
        env: { ...process.env, ...options.env },
      };

      if (workingDir && command.startsWith('ddev ')) {
        // Use cd to preserve symlinks for DDEV commands
        finalCommand = `cd "${workingDir}" && ${command}`;
        // Don't set cwd option when using cd in the command
      } else {
        // For non-DDEV commands, use the normal cwd option
        finalOptions.cwd = workingDir;
      }

      const { stdout, stderr } = await execAsync(finalCommand, finalOptions);
      const duration = Date.now() - startTime;

      const result: CommandResult = {
        success: true,
        output: stdout.toString().trim(),
        error: stderr.toString().trim() || undefined,
        exitCode: 0,
        duration
      };

      this.logger.debug('Command completed successfully', {
        command: this.sanitizeCommand(command),
        duration,
        outputLength: stdout.length
      });

      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;

      const result: CommandResult = {
        success: false,
        output: error.stdout?.toString().trim() || '',
        error: error.stderr?.toString().trim() || error.message,
        exitCode: error.code || 1,
        duration
      };

      this.logger.warn('Command failed', {
        command: this.sanitizeCommand(command),
        exitCode: result.exitCode,
        error: result.error,
        duration
      });

      return result;
    }
  }

  /**
   * Execute a DDEV-specific command
   */
  async executeDDEV(subcommand: string, args: string[] = [], options: ExecOptions = {}): Promise<CommandResult> {
    const command = `ddev ${subcommand} ${args.join(' ')}`.trim();
    return this.execute(command, options);
  }

  /**
   * Check if DDEV is available
   */
  async checkDDEVAvailable(): Promise<boolean> {
    try {
      const result = await this.execute('ddev version', { timeout: 5000 });
      return result.success;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize command for logging (remove sensitive information)
   */
  private sanitizeCommand(command: string): string {
    // Remove potential passwords, tokens, etc.
    return command
      .replace(/password[=\s]+[\w\-!@#$%^&*()]+/gi, 'password=***')
      .replace(/token[=\s]+[\w\-]+/gi, 'token=***')
      .replace(/key[=\s]+[\w\-]+/gi, 'key=***');
  }

  /**
   * Sanitize options for logging
   */
  private sanitizeOptions(options: ExecOptions): Partial<ExecOptions> {
    const sanitized: Partial<ExecOptions> = {
      cwd: options.cwd,
      timeout: options.timeout,
      maxBuffer: options.maxBuffer
    };

    // Don't log environment variables to avoid leaking secrets
    if (options.env) {
      sanitized.env = Object.keys(options.env).reduce((acc, key) => {
        acc[key] = key.toLowerCase().includes('password') ||
                   key.toLowerCase().includes('token') ||
                   key.toLowerCase().includes('key') ? '***' : options.env![key];
        return acc;
      }, {} as Record<string, string>);
    }

    return sanitized;
  }


  /**
   * Get the current working directory
   * @returns The current working directory
   */
  async pwd(): Promise<string> {
    // Use PWD environment variable first (preserves symlinks)
    if (process.env.PWD) {
      return process.env.PWD;
    }

    // Fallback to execSync pwd
    const result = execSync('pwd');
    return result.toString().trim();
  }
}
