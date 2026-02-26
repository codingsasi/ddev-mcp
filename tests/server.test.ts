/**
 * Basic tests for DDEV MCP Server
 */

import { DDEV_TOOLS, getToolDefinition, validateToolArguments } from '../src/server/tools.js';

describe('DDEV MCP Server', () => {
  describe('Tool Definitions', () => {
    test('should have all expected DDEV tools', () => {
      const expectedDDEVTools = [
        'ddev_start',
        'ddev_stop',
        'ddev_restart',
        'ddev_describe',
        'ddev_list',
        'ddev_import_db',
        'ddev_export_db',
        'ddev_logs',
        'ddev_snapshot',
        'ddev_exec',
        'ddev_poweroff',
        'ddev_version',
        'ddev_help'
      ];

      const toolNames = DDEV_TOOLS.map(tool => tool.name);
      expectedDDEVTools.forEach(expectedTool => {
        expect(toolNames).toContain(expectedTool);
      });
    });

    test('should have ddev_exec for running any command', () => {
      const toolNames = DDEV_TOOLS.map(tool => tool.name);
      expect(toolNames).toContain('ddev_exec');
      const execTool = getToolDefinition('ddev_exec');
      expect(execTool?.description).toMatch(/exec|command/i);
    });

    test('should get tool definition by name', () => {
      const startTool = getToolDefinition('ddev_start');
      expect(startTool).toBeDefined();
      expect(startTool?.name).toBe('ddev_start');
      expect(startTool?.description).toContain('Start a DDEV project');
    });

    test('should return undefined for unknown tool', () => {
      const unknownTool = getToolDefinition('unknown_tool');
      expect(unknownTool).toBeUndefined();
    });
  });

  describe('Argument Validation', () => {
    test('should validate required arguments for ddev_exec', () => {
      // Valid arguments (projectPath + command required)
      const validResult = validateToolArguments('ddev_exec', {
        projectPath: '/path/to/project',
        command: 'drush cr'
      });
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toBeUndefined();

      // Missing required argument: command
      const missingCommand = validateToolArguments('ddev_exec', { projectPath: '/path' });
      expect(missingCommand.valid).toBe(false);
      expect(missingCommand.errors).toContain('Missing required field: command');

      // Missing required argument: projectPath
      const missingPath = validateToolArguments('ddev_exec', { command: 'drush cr' });
      expect(missingPath.valid).toBe(false);
      expect(missingPath.errors).toContain('Missing required field: projectPath');
    });

    test('should validate argument types', () => {
      const result = validateToolArguments('ddev_start', {
        projectPath: 123 // Should be string
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field projectPath must be a string');
    });

    test('should reject unknown tools', () => {
      const result = validateToolArguments('unknown_tool', {});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unknown tool: unknown_tool');
    });
  });
});
