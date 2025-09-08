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
        'ddev_status',
        'ddev_describe',
        'ddev_import_db',
        'ddev_export_db',
        'ddev_drush',
        'ddev_composer',
        'ddev_logs',
        'ddev_ssh'
      ];

      const toolNames = DDEV_TOOLS.map(tool => tool.name);
      expectedDDEVTools.forEach(expectedTool => {
        expect(toolNames).toContain(expectedTool);
      });
    });

    test('should have all expected WordPress tools', () => {
      const expectedWPTools = [
        'ddev_wp_cli',
        'ddev_wp_site_info',
        'ddev_wp_plugin_install',
        'ddev_wp_plugin_toggle',
        'ddev_wp_plugin_list',
        'ddev_wp_theme_install',
        'ddev_wp_theme_activate',
        'ddev_wp_core_update',
        'ddev_wp_rewrite_flush',
        'ddev_wp_search_replace'
      ];

      const toolNames = DDEV_TOOLS.map(tool => tool.name);
      expectedWPTools.forEach(expectedTool => {
        expect(toolNames).toContain(expectedTool);
      });
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
    test('should validate required arguments for ddev_drush', () => {
      // Valid arguments
      const validResult = validateToolArguments('ddev_drush', {
        command: 'cr'
      });
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toBeUndefined();

      // Missing required argument
      const invalidResult = validateToolArguments('ddev_drush', {});
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors).toContain('Missing required field: command');
    });

    test('should validate required arguments for WordPress tools', () => {
      // Valid WP-CLI command
      const validWPResult = validateToolArguments('ddev_wp_cli', {
        command: 'plugin list'
      });
      expect(validWPResult.valid).toBe(true);
      expect(validWPResult.errors).toBeUndefined();

      // Valid plugin installation
      const validPluginResult = validateToolArguments('ddev_wp_plugin_install', {
        plugin: 'akismet'
      });
      expect(validPluginResult.valid).toBe(true);

      // Missing required plugin name
      const invalidPluginResult = validateToolArguments('ddev_wp_plugin_install', {});
      expect(invalidPluginResult.valid).toBe(false);
      expect(invalidPluginResult.errors).toContain('Missing required field: plugin');

      // Valid search/replace
      const validSearchReplaceResult = validateToolArguments('ddev_wp_search_replace', {
        oldUrl: 'https://old-site.com',
        newUrl: 'https://new-site.com'
      });
      expect(validSearchReplaceResult.valid).toBe(true);

      // Missing required URLs
      const invalidSearchReplaceResult = validateToolArguments('ddev_wp_search_replace', {
        oldUrl: 'https://old-site.com'
      });
      expect(invalidSearchReplaceResult.valid).toBe(false);
      expect(invalidSearchReplaceResult.errors).toContain('Missing required field: newUrl');
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
