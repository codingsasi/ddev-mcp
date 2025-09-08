# Platform.sh Redeploy Test

This document explains how to test the platform.sh redeploy functionality with user input confirmation.

## What Was Changed

1. **Simplified User Input**: The user input mechanism now opens a terminal window and asks for a simple "y" for yes, anything else for no.

2. **Platform Command Safety**: The `ddev_platform` tool now properly checks for dangerous commands like `environment:redeploy` and prompts for user confirmation.

3. **Terminal-Based Confirmation**: Instead of using complex readline interfaces, the system now:
   - Opens a new terminal window
   - Displays a clear warning message
   - Asks for simple "y" input
   - Automatically cancels if anything other than "y" is entered

## How to Test

### 1. Build the Project
```bash
npm run build
```

### 2. Test User Input Only
```bash
node test-user-input.js
```
This will test just the user input functionality.

### 3. Test Platform Redeploy
```bash
node test-platform-simple.js
```
This will test the full platform redeploy flow with user confirmation.

### 4. Test with MCP Server
```bash
node test-redeploy.js
```
This will test through the MCP server interface.

## Expected Behavior

1. **Terminal Window Opens**: A new terminal window should open with a warning message
2. **Clear Instructions**: The message should clearly state "Type 'y' to proceed, anything else to cancel"
3. **User Input**: You can type "y" to proceed or anything else to cancel
4. **Automatic Cleanup**: The terminal window will close after input
5. **Result**: The command will either proceed or be cancelled based on your input

## Testing Different Scenarios

### Test 1: Confirm with "y"
- Run the test
- Type "y" in the terminal window
- Should proceed with the command

### Test 2: Cancel with "n"
- Run the test
- Type "n" in the terminal window
- Should cancel the command

### Test 3: Cancel with any other input
- Run the test
- Type anything other than "y" (e.g., "no", "cancel", "abort")
- Should cancel the command

### Test 4: Timeout
- Run the test
- Don't respond within the timeout period (5 minutes)
- Should automatically cancel

## Troubleshooting

If the terminal window doesn't open:
1. Make sure you have `gnome-terminal` installed
2. Check that the script has execute permissions
3. Verify the build completed successfully

If the test hangs:
1. Check the console output for error messages
2. Look for any file permission issues in `/tmp/`
3. Verify the response file is being created and read properly

## Code Changes Made

### `src/utils/userInput.ts`
- Replaced complex readline interface with simple terminal-based approach
- Uses `gnome-terminal` to open a new window
- Creates a bash script that prompts for "y" input
- Polls for response file to get user input
- Automatically cleans up temporary files

### `src/server/index.ts`
- Updated platform command handling to use simplified user input
- Changed confirmation message to be clearer
- Increased timeout to 5 minutes for dangerous commands
- Simplified the response checking logic

## Security Features

1. **Clear Warnings**: All dangerous commands show clear warning messages
2. **Simple Confirmation**: Only "y" is accepted as confirmation
3. **Timeout Protection**: Commands automatically cancel after timeout
4. **File Cleanup**: Temporary files are automatically cleaned up
5. **Error Handling**: Proper error handling for all edge cases
