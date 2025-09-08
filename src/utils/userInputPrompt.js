#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';

async function main() {
  const sessionId = process.argv[2];
  if (!sessionId) {
    console.error('No session ID provided');
    process.exit(1);
  }

  const tempDir = os.tmpdir();
  const optionsFile = path.join(tempDir, `ddev-mcp-options-${sessionId}.json`);
  const responseFile = path.join(tempDir, `ddev-mcp-response-${sessionId}.txt`);

  try {
    // Read options
    const optionsData = await fs.readFile(optionsFile, 'utf8');
    const options = JSON.parse(optionsData);

    console.clear();
    console.log('🔔 DDEV MCP - User Input Required\n');
    console.log('─'.repeat(60));
    console.log(`${options.message}\n`);

    if (options.predefinedOptions && options.predefinedOptions.length > 0) {
      console.log('Available options:');
      options.predefinedOptions.forEach((opt, i) => {
        console.log(`  ${i + 1}. ${opt}`);
      });
      console.log('');
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Set up timeout
    const timeoutMs = (options.timeout || 60) * 1000;
    const timer = setTimeout(async () => {
      console.log('\n⏰ Timeout reached. Cancelling...');
      await fs.writeFile(responseFile, '__TIMEOUT__', 'utf8');
      rl.close();
      process.exit(0);
    }, timeoutMs);

    // Show countdown in title (simplified)
    let timeLeft = options.timeout || 60;
    const countdownTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
      }
    }, 1000);

    const promptText = options.predefinedOptions && options.predefinedOptions.length > 0
      ? 'Your choice (number or custom text): '
      : 'Your response: ';

    rl.question(promptText, async (answer) => {
      clearTimeout(timer);
      clearInterval(countdownTimer);

      let finalAnswer = answer.trim();

      // If user entered a number and we have predefined options, use that option
      if (options.predefinedOptions && options.predefinedOptions.length > 0) {
        const num = parseInt(finalAnswer);
        if (!isNaN(num) && num >= 1 && num <= options.predefinedOptions.length) {
          finalAnswer = options.predefinedOptions[num - 1];
        }
      }

      await fs.writeFile(responseFile, finalAnswer, 'utf8');
      console.log(`✅ Response recorded: ${finalAnswer}`);

      rl.close();

      // Give user a moment to see the confirmation
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });

    // Handle Ctrl+C
    rl.on('SIGINT', async () => {
      console.log('\n❌ Cancelled by user');
      await fs.writeFile(responseFile, '', 'utf8');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error:', error.message);
    try {
      await fs.writeFile(responseFile, '', 'utf8');
    } catch {
      // Ignore
    }
    process.exit(1);
  }
}

main().catch(console.error);
