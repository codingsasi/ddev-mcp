#!/usr/bin/env node
/**
 * Run DDEV MCP tools like an AI would: connect via stdio, list tools, then call
 * a sequence of tools with typical arguments and print each result to the terminal.
 * Run from project root: node tests/run-mcp-tools-like-ai.mjs
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const serverPath = join(projectRoot, 'dist', 'index.js');

function print(title, text) {
  const line = '─'.repeat(60);
  console.log(`\n${line}`);
  console.log(title);
  console.log(line);
  console.log(text || '(no output)');
}

function getTextFromResult(result) {
  if (result.isError) return `Error: ${result.content?.map(c => c.text).join('\n') || result.message}`;
  if (!result.content || !Array.isArray(result.content)) return '';
  return result.content.map(c => c.type === 'text' ? c.text : JSON.stringify(c)).join('\n');
}

async function main() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath],
    cwd: projectRoot,
  });
  const client = new Client(
    { name: 'bats-ai-test', version: '1.0.0' },
    {},
  );

  try {
    await client.connect(transport);
  } catch (err) {
    console.error('Failed to connect to MCP server. Run "npm run build" first.');
    console.error(err.message);
    process.exit(1);
  }

  try {
    // 1. List tools (like an AI discovering capabilities)
    const listResult = await client.listTools();
    const tools = listResult.tools || [];
    print('TOOLS LIST (what the AI sees)', `${tools.length} tools: ${tools.map(t => t.name).join(', ')}`);

    // 2. ddev_version (no project needed)
    const versionResult = await client.callTool({ name: 'ddev_version', arguments: {} });
    print('ddev_version', getTextFromResult(versionResult));

    // 3. ddev_help for import-db (AI looking up how to import DB)
    const helpImportResult = await client.callTool({
      name: 'ddev_help',
      arguments: { command: 'import-db' },
    });
    print('ddev_help (command=import-db)', getTextFromResult(helpImportResult));

    // 4. ddev_list (AI listing projects)
    const listProjectsResult = await client.callTool({ name: 'ddev_list', arguments: {} });
    print('ddev_list', getTextFromResult(listProjectsResult));

    // 5. ddev_help with subcommand (AI looking up snapshot restore)
    const helpSnapshotResult = await client.callTool({
      name: 'ddev_help',
      arguments: { command: 'snapshot', subcommand: 'restore' },
    });
    print('ddev_help (command=snapshot, subcommand=restore)', getTextFromResult(helpSnapshotResult));

    // 6. message_complete_notification (AI notifying user)
    const notifResult = await client.callTool({
      name: 'message_complete_notification',
      arguments: { title: 'DDEV MCP Bats Test', message: 'Tool run completed successfully.' },
    });
    print('message_complete_notification', getTextFromResult(notifResult));

    console.log('\n' + '═'.repeat(60));
    console.log('All tool calls finished. Output shown above.');
    console.log('═'.repeat(60) + '\n');
  } catch (err) {
    console.error('Tool call failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
