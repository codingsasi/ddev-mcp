export interface ConfirmationOptions {
  message: string;
  timeout?: number;
  defaultYes?: boolean;
}

/**
 * Simple yes/no confirmation function
 * Perfect for dangerous operations and can be easily plugged into any DDEV tool
 */
export async function confirmAction(options: ConfirmationOptions): Promise<boolean> {
  const { message, timeout = 60, defaultYes = false } = options;

  try {
    const { createInterface } = await import('readline');
    
    // Display the prompt with consistent formatting
    console.log(`\n🔔 DDEV MCP User Input Required:`);
    console.log(`${message}`);
    console.log(''); // Empty line for clarity

    // Create readline interface
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      // Set up timeout
      const timer = setTimeout(() => {
        rl.close();
        resolve(defaultYes); // Return default on timeout
      }, timeout * 1000);

      // Simple yes/no prompt
      const promptText = 'Type "y" to proceed, anything else to cancel: ';
      
      rl.question(promptText, (answer: string) => {
        clearTimeout(timer);
        rl.close();

        const response = answer.trim().toLowerCase();
        const isYes = response === 'y' || response === 'yes';
        
        resolve(isYes);
      });
    });

  } catch (error) {
    // Return default on error
    return defaultYes;
  }
}
