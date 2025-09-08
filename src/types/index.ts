/**
 * DDEV MCP Server Types
 * Type definitions for DDEV MCP server operations
 */

export interface DDEVCommandOptions {
  projectPath?: string;
  projectName?: string;
  timeout?: number;
}

export interface DDEVStartOptions extends DDEVCommandOptions {
  skipHooks?: boolean;
  skipConfirmation?: boolean;
}

export interface DDEVImportDBOptions extends DDEVCommandOptions {
  src?: string;
  srcRaw?: string;
  extractPath?: string;
  noActivatePlugins?: boolean;
  targetDb?: string;
}

export interface DDEVExportDBOptions extends DDEVCommandOptions {
  file?: string;
  compressionType?: 'gzip' | 'bzip2' | 'xz';
  targetDb?: string;
}

export interface DDEVDrushOptions extends DDEVCommandOptions {
  command: string;
  args?: string[];
  uri?: string;
  root?: string;
}

export interface DDEVComposerOptions extends DDEVCommandOptions {
  command: string;
  args?: string[];
}

export interface DDEVWPCLIOptions extends DDEVCommandOptions {
  command: string;
  args?: string[];
  url?: string;
  path?: string;
  skipPlugins?: boolean;
  skipThemes?: boolean;
}

export interface WordPressPluginInfo {
  name: string;
  status: 'active' | 'inactive' | 'must-use';
  update: 'available' | 'none';
  version: string;
}

export interface WordPressThemeInfo {
  name: string;
  status: 'active' | 'inactive';
  update: 'available' | 'none';
  version: string;
}

export interface WordPressSiteInfo {
  url: string;
  wpVersion: string;
  phpVersion: string;
  dbVersion: string;
  theme: {
    name: string;
    version: string;
  };
  plugins: {
    active: number;
    inactive: number;
    total: number;
  };
}

export interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  duration: number;
}

export interface DDEVStatus {
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'stopping' | 'unhealthy';
  location: string;
  urls: {
    primary: string;
    https?: string;
    [key: string]: string | undefined;
  };
  type: string;
  version: string;
  phpVersion?: string;
  webserver?: string;
  database?: {
    type: string;
    version: string;
  };
  services?: Array<{
    name: string;
    status: string;
    ports?: string[];
  }>;
}

export interface ToolCallRequest {
  method: string;
  params: {
    name: string;
    arguments?: Record<string, any>;
  };
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPError extends Error {
  code?: string;
  data?: any;
}
