import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export interface UserInputOptions {
  message: string;
  options?: string[];
  timeout?: number;
}

export interface UserInputResult {
  success: boolean;
  response?: string;
  timedOut?: boolean;
  error?: string;
}

/**
 * Display a user input prompt and wait for response
 * Based on interactive-mcp approach but simplified for our needs
 */
export async function getUserInput(options: UserInputOptions): Promise<UserInputResult> {
  const { message, options: predefinedOptions = [], timeout = 60 } = options;

  // Create temporary files for communication
  const sessionId = crypto.randomBytes(8).toString('hex');
  const tempDir = os.tmpdir();
  const responseFile = path.join(tempDir, `ddev-mcp-response-${sessionId}.txt`);
  const optionsFile = path.join(tempDir, `ddev-mcp-options-${sessionId}.json`);

  try {
    // Write options to file
    const promptOptions = {
      message,
      predefinedOptions,
      timeout,
      responseFile,
      sessionId
    };

    await fs.writeFile(optionsFile, JSON.stringify(promptOptions), 'utf8');

    // Create empty response file
    await fs.writeFile(responseFile, '', 'utf8');

    // Use direct console approach for better reliability
    console.log(`\n🔔 DDEV MCP User Input Required:`);
    console.log(`${message}`);
    if (predefinedOptions.length > 0) {
      console.log(`Options: ${predefinedOptions.join(', ')}`);
    }

    // Simple readline approach
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        rl.close();
        resolve({ success: false, timedOut: true });
      }, timeout * 1000);

      const promptText = predefinedOptions.length > 0
        ? 'Your choice (number or custom text): '
        : 'Your response: ';

      rl.question(promptText, (answer: string) => {
        clearTimeout(timer);
        rl.close();

        let finalAnswer = answer.trim();

        // If user entered a number and we have predefined options, use that option
        if (predefinedOptions.length > 0) {
          const num = parseInt(finalAnswer);
          if (!isNaN(num) && num >= 1 && num <= predefinedOptions.length) {
            finalAnswer = predefinedOptions[num - 1];
          }
        }

        resolve({ success: true, response: finalAnswer });
      });
    });

  } catch (error) {
    await cleanup();
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  async function cleanup() {
    try {
      await Promise.allSettled([
        fs.unlink(responseFile).catch(() => {}),
        fs.unlink(optionsFile).catch(() => {})
      ]);
    } catch {
      // Ignore cleanup errors
    }
  }
}
