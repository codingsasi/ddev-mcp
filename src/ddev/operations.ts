/**
 * DDEV Operations Handler
 * Core DDEV command implementations following patterns from Playwright MCP
 */

import {
  DDEVCommandOptions,
  DDEVStartOptions,
  DDEVImportDBOptions,
  DDEVExportDBOptions,
  DDEVDrushOptions,
  DDEVComposerOptions,
  DDEVWPCLIOptions,
  CommandResult,
  DDEVStatus,
  WordPressSiteInfo
} from '../types/index.js';
import { CommandExecutor } from '../utils/command.js';
import { Logger } from '../utils/logger.js';

export class DDEVOperations {
  private commandExecutor: CommandExecutor;
  private logger: Logger;
  private defaultProjectPath?: string;

  constructor(logger?: Logger) {
    this.logger = logger || new Logger('DDEVOperations');
    this.commandExecutor = new CommandExecutor(this.logger.child('CommandExecutor'));
  }

  /**
   * Set the default project path for subsequent operations
   */
  setDefaultProjectPath(path: string): void {
    this.defaultProjectPath = path;
    this.logger.debug('Set default project path', { defaultProjectPath: this.defaultProjectPath });
  }

  /**
   * Get the effective project path (provided path or default)
   */
  private getEffectiveProjectPath(providedPath?: string): string | undefined {
    return providedPath || this.defaultProjectPath;
  }

  /**
   * Start DDEV project
   */
  async start(options: DDEVStartOptions = {}): Promise<CommandResult> {
    const effectivePath = this.getEffectiveProjectPath(options.projectPath);
    this.logger.info('Starting DDEV project', {
      providedPath: options.projectPath,
      effectivePath,
      options
    });

    const args: string[] = [];
    if (options.skipHooks) args.push('--skip-hooks');
    if (options.skipConfirmation) args.push('--yes');

    const execOptions = {
      cwd: effectivePath,
      timeout: options.timeout || 120000 // 2 minutes for DDEV start
    };

    return await this.commandExecutor.executeDDEV('start', args, execOptions);
  }

  /**
   * Stop DDEV project
   */
  async stop(options: DDEVCommandOptions = {}): Promise<CommandResult> {
    const effectivePath = this.getEffectiveProjectPath(options.projectPath);
    this.logger.info('Stopping DDEV project', {
      providedPath: options.projectPath,
      effectivePath,
      options
    });

    const execOptions = {
      cwd: effectivePath,
      timeout: options.timeout || 60000 // 1 minute for DDEV stop
    };

    return await this.commandExecutor.executeDDEV('stop', [], execOptions);
  }

  /**
   * Restart DDEV project
   */
  async restart(options: DDEVCommandOptions = {}): Promise<CommandResult> {
    this.logger.info('Restarting DDEV project', { options });

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 180000 // 3 minutes for restart
    };

    return await this.commandExecutor.executeDDEV('restart', [], execOptions);
  }

  /**
   * Get DDEV project status
   */
  async status(options: DDEVCommandOptions = {}): Promise<CommandResult> {
    this.logger.debug('Getting DDEV project status', { options });

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('status', [], execOptions);
  }

  /**
   * Get detailed DDEV project information
   */
  async describe(options: DDEVCommandOptions = {}): Promise<CommandResult> {
    this.logger.debug('Getting DDEV project description', { options });

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('describe', [], execOptions);
  }

  /**
   * List all DDEV projects
   */
  async list(options: { activeOnly?: boolean; timeout?: number } = {}): Promise<CommandResult> {
    this.logger.debug('Listing DDEV projects', { options });

    const args: string[] = [];
    if (options.activeOnly) {
      args.push('--active-only');
    }

    const execOptions = {
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('list', args, execOptions);
  }

  /**
   * Import database
   */
  async importDB(options: DDEVImportDBOptions): Promise<CommandResult> {
    this.logger.info('Importing database', {
      src: options.src,
      targetDb: options.targetDb,
      projectPath: options.projectPath
    });

    const args: string[] = [];
    if (options.src) args.push(`--src=${options.src}`);
    if (options.srcRaw) args.push(`--src-raw=${options.srcRaw}`);
    if (options.extractPath) args.push(`--extract-path=${options.extractPath}`);
    if (options.noActivatePlugins) args.push('--no-activate-plugins');
    if (options.targetDb) args.push(`--target-db=${options.targetDb}`);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 300000 // 5 minutes for DB import
    };

    return await this.commandExecutor.executeDDEV('import-db', args, execOptions);
  }

  /**
   * Export database
   */
  async exportDB(options: DDEVExportDBOptions = {}): Promise<CommandResult> {
    this.logger.info('Exporting database', {
      file: options.file,
      compressionType: options.compressionType,
      projectPath: options.projectPath
    });

    const args: string[] = [];
    if (options.file) args.push(`--file=${options.file}`);
    if (options.compressionType) args.push(`--${options.compressionType}`);
    if (options.targetDb) args.push(`--target-db=${options.targetDb}`);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 300000 // 5 minutes for DB export
    };

    return await this.commandExecutor.executeDDEV('export-db', args, execOptions);
  }

  /**
   * Execute Drush command
   */
  async drush(options: DDEVDrushOptions): Promise<CommandResult> {
    this.logger.info('Executing Drush command', {
      command: options.command,
      args: options.args,
      projectPath: options.projectPath
    });

    const args: string[] = [options.command];
    if (options.args) args.push(...options.args);
    if (options.uri) args.push(`--uri=${options.uri}`);
    if (options.root) args.push(`--root=${options.root}`);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000 // 2 minutes for Drush commands
    };

    return await this.commandExecutor.executeDDEV('drush', args, execOptions);
  }

  /**
   * Execute Composer command
   */
  async composer(options: DDEVComposerOptions): Promise<CommandResult> {
    this.logger.info('Executing Composer command', {
      command: options.command,
      args: options.args,
      projectPath: options.projectPath
    });

    const args: string[] = [options.command];
    if (options.args) args.push(...options.args);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 300000 // 5 minutes for Composer commands
    };

    return await this.commandExecutor.executeDDEV('composer', args, execOptions);
  }

  /**
   * Get DDEV logs
   */
  async logs(options: DDEVCommandOptions & { service?: string; follow?: boolean; tail?: number } = {}): Promise<CommandResult> {
    this.logger.debug('Getting DDEV logs', { options });

    const args: string[] = [];
    if (options.service) args.push(options.service);
    if (options.follow) args.push('--follow');
    if (options.tail) args.push(`--tail=${options.tail}`);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('logs', args, execOptions);
  }

  /**
   * Get SSH connection info and container details (AI-friendly)
   */
  async ssh(options: DDEVCommandOptions & { service?: string }): Promise<CommandResult> {
    this.logger.info('Getting SSH connection info for DDEV service', {
      service: options.service,
      projectPath: options.projectPath
    });

    const service = options.service || 'web';

    // Use exec to get useful container information instead of opening SSH
    const command = `echo "=== Container Info for ${service} service ===" && hostname && whoami && pwd && echo "=== PHP Version ===" && php -v && echo "=== Environment ===" && env | grep -E "(DDEV|DRUPAL)" | head -10`;

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('exec', [`--service=${service}`, command], execOptions);
  }

  /**
   * Check if DDEV is available and working
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const result = await this.commandExecutor.executeDDEV('version', [], { timeout: 5000 });
      return result.success;
    } catch (error) {
      this.logger.error('DDEV availability check failed', { error });
      return false;
    }
  }

  /**
   * Execute WP-CLI command
   */
  async wpCli(options: DDEVWPCLIOptions): Promise<CommandResult> {
    this.logger.info('Executing WP-CLI command', {
      command: options.command,
      args: options.args,
      projectPath: options.projectPath
    });

    const args: string[] = [options.command];
    if (options.args) args.push(...options.args);
    if (options.url) args.push(`--url=${options.url}`);
    if (options.path) args.push(`--path=${options.path}`);
    if (options.skipPlugins) args.push('--skip-plugins');
    if (options.skipThemes) args.push('--skip-themes');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000 // 2 minutes for WP-CLI commands
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Get WordPress site information
   */
  async getWordPressSiteInfo(options: DDEVCommandOptions = {}): Promise<CommandResult> {
    this.logger.info('Getting WordPress site information', { projectPath: options.projectPath });

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('wp', ['core', 'version', '--extra'], execOptions);
  }

  /**
   * Install WordPress plugins
   */
  async installWordPressPlugin(options: DDEVCommandOptions & { plugin: string; activate?: boolean; version?: string }): Promise<CommandResult> {
    this.logger.info('Installing WordPress plugin', {
      plugin: options.plugin,
      activate: options.activate,
      projectPath: options.projectPath
    });

    const args = ['plugin', 'install', options.plugin];
    if (options.activate) args.push('--activate');
    if (options.version) args.push(`--version=${options.version}`);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Activate/Deactivate WordPress plugins
   */
  async toggleWordPressPlugin(options: DDEVCommandOptions & { plugin: string; action: 'activate' | 'deactivate' }): Promise<CommandResult> {
    this.logger.info('Toggling WordPress plugin', {
      plugin: options.plugin,
      action: options.action,
      projectPath: options.projectPath
    });

    const args = ['plugin', options.action, options.plugin];

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * List WordPress plugins
   */
  async listWordPressPlugins(options: DDEVCommandOptions & { status?: 'active' | 'inactive' | 'all' } = {}): Promise<CommandResult> {
    this.logger.debug('Listing WordPress plugins', {
      status: options.status,
      projectPath: options.projectPath
    });

    const args = ['plugin', 'list'];
    if (options.status && options.status !== 'all') {
      args.push(`--status=${options.status}`);
    }
    args.push('--format=table');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Install WordPress themes
   */
  async installWordPressTheme(options: DDEVCommandOptions & { theme: string; activate?: boolean; version?: string }): Promise<CommandResult> {
    this.logger.info('Installing WordPress theme', {
      theme: options.theme,
      activate: options.activate,
      projectPath: options.projectPath
    });

    const args = ['theme', 'install', options.theme];
    if (options.activate) args.push('--activate');
    if (options.version) args.push(`--version=${options.version}`);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Activate WordPress themes
   */
  async activateWordPressTheme(options: DDEVCommandOptions & { theme: string }): Promise<CommandResult> {
    this.logger.info('Activating WordPress theme', {
      theme: options.theme,
      projectPath: options.projectPath
    });

    const args = ['theme', 'activate', options.theme];

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Update WordPress core
   */
  async updateWordPressCore(options: DDEVCommandOptions & { version?: string; force?: boolean } = {}): Promise<CommandResult> {
    this.logger.info('Updating WordPress core', {
      version: options.version,
      force: options.force,
      projectPath: options.projectPath
    });

    const args = ['core', 'update'];
    if (options.version) args.push(`--version=${options.version}`);
    if (options.force) args.push('--force');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 300000 // 5 minutes for core updates
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Flush WordPress rewrite rules
   */
  async flushWordPressRewrites(options: DDEVCommandOptions = {}): Promise<CommandResult> {
    this.logger.info('Flushing WordPress rewrite rules', { projectPath: options.projectPath });

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('wp', ['rewrite', 'flush'], execOptions);
  }

  /**
   * WordPress database search and replace
   */
  async wordPressSearchReplace(options: DDEVCommandOptions & {
    oldUrl: string;
    newUrl: string;
    dryRun?: boolean;
    skipColumns?: string[];
  }): Promise<CommandResult> {
    this.logger.info('WordPress search and replace', {
      oldUrl: options.oldUrl,
      newUrl: options.newUrl,
      dryRun: options.dryRun,
      projectPath: options.projectPath
    });

    const args = ['search-replace', options.oldUrl, options.newUrl];
    if (options.dryRun) args.push('--dry-run');
    if (options.skipColumns) {
      args.push(`--skip-columns=${options.skipColumns.join(',')}`);
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Parse DDEV status output into structured data
   */
  parseStatus(statusOutput: string): Partial<DDEVStatus> {
    const lines = statusOutput.split('\n');
    const status: Partial<DDEVStatus> = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('Project name:')) {
        status.name = trimmed.split(':')[1]?.trim();
      } else if (trimmed.includes('Status:')) {
        const statusText = trimmed.split(':')[1]?.trim().toLowerCase();
        status.status = statusText as DDEVStatus['status'];
      } else if (trimmed.includes('Location:')) {
        status.location = trimmed.split(':')[1]?.trim();
      } else if (trimmed.includes('Primary URL:')) {
        const url = trimmed.split(':')[1]?.trim();
        if (url) {
          status.urls = { primary: url };
        }
      }
    }

    return status;
  }

  /**
   * Parse WordPress site info from WP-CLI output
   */
  parseWordPressSiteInfo(wpCliOutput: string): Partial<WordPressSiteInfo> {
    const lines = wpCliOutput.split('\n');
    const siteInfo: Partial<WordPressSiteInfo> = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('WordPress version:')) {
        siteInfo.wpVersion = trimmed.split(':')[1]?.trim();
      } else if (trimmed.includes('Database version:')) {
        siteInfo.dbVersion = trimmed.split(':')[1]?.trim();
      } else if (trimmed.includes('PHP version:')) {
        siteInfo.phpVersion = trimmed.split(':')[1]?.trim();
      }
    }

    return siteInfo;
  }

  // Additional DDEV commands

  /**
   * Configure DDEV project
   */
  async config(options: DDEVCommandOptions & {
    projectName?: string;
    projectType?: string;
    docroot?: string;
    phpVersion?: string;
    database?: string;
    auto?: boolean;
    showConfig?: boolean;
  }): Promise<CommandResult> {
    this.logger.info('Configuring DDEV project', {
      projectPath: options.projectPath,
      projectType: options.projectType,
      showConfig: options.showConfig
    });

    const args: string[] = [];

    // If no specific config changes requested, show current config
    if (options.showConfig || (!options.projectName && !options.projectType && !options.docroot && !options.phpVersion && !options.database)) {
      args.push('--show-config-location');

      const execOptions = {
        cwd: options.projectPath,
        timeout: options.timeout || 30000
      };

      return await this.commandExecutor.executeDDEV('config', args, execOptions);
    }

    // For modifications, always use auto mode for AI usage
    args.push('--auto');

    if (options.projectName) args.push(`--project-name=${options.projectName}`);
    if (options.projectType) args.push(`--project-type=${options.projectType}`);
    if (options.docroot) args.push(`--docroot=${options.docroot}`);
    if (options.phpVersion) args.push(`--php-version=${options.phpVersion}`);
    if (options.database) args.push(`--database=${options.database}`);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('config', args, execOptions);
  }

  /**
   * Delete DDEV project
   */
  async delete(options: DDEVCommandOptions & {
    projectName: string;
    omitSnapshot?: boolean;
    confirmDelete?: boolean;
  }): Promise<CommandResult> {
    this.logger.info('Deleting DDEV project', {
      projectPath: options.projectPath,
      projectName: options.projectName,
      confirmDelete: options.confirmDelete
    });

    // Safety check - require explicit confirmation
    if (!options.confirmDelete) {
      return {
        success: false,
        output: '',
        error: 'Delete operation requires explicit confirmation. Set confirmDelete: true to proceed.',
        exitCode: 1,
        duration: 0
      };
    }

    const args: string[] = [options.projectName];

    if (options.omitSnapshot) args.push('--omit-snapshot');
    // Always use -y for AI operations (since we have explicit confirmation)
    args.push('-y');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('delete', args, execOptions);
  }

  /**
   * Clean DDEV items
   */
  async clean(options: DDEVCommandOptions & {
    all?: boolean;
    dryRun?: boolean;
  }): Promise<CommandResult> {
    this.logger.info('Cleaning DDEV items', {
      all: options.all,
      dryRun: options.dryRun
    });

    const args: string[] = [];

    if (options.all) args.push('--all');
    if (options.dryRun) args.push('--dry-run');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('clean', args, execOptions);
  }

  /**
   * Manage database snapshots
   */
  async snapshot(options: DDEVCommandOptions & {
    action?: 'create' | 'list' | 'restore' | 'cleanup';
    name?: string;
    snapshotName?: string;
    all?: boolean;
    yes?: boolean;
  }): Promise<CommandResult> {
    const action = options.action || 'create';

    this.logger.info('Managing database snapshots', {
      action,
      projectPath: options.projectPath
    });

    const args: string[] = [];

    switch (action) {
      case 'list':
        args.push('--list');
        break;
      case 'cleanup':
        args.push('--cleanup');
        if (options.yes) args.push('-y');
        break;
      case 'restore':
        if (options.snapshotName) {
          args.push('restore', options.snapshotName);
        }
        break;
      case 'create':
      default:
        if (options.name) args.push(`--name=${options.name}`);
        if (options.all) args.push('--all');
        break;
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 300000
    };

    return await this.commandExecutor.executeDDEV('snapshot', args, execOptions);
  }

  /**
   * Import files to DDEV project
   */
  async importFiles(options: DDEVCommandOptions & {
    src: string;
    extractPath?: string;
    target?: string;
  }): Promise<CommandResult> {
    this.logger.info('Importing files to DDEV project', {
      src: options.src,
      target: options.target,
      projectPath: options.projectPath
    });

    const args: string[] = [`--source=${options.src}`];

    if (options.extractPath) {
      args.push(`--extract-path=${options.extractPath}`);
    }

    if (options.target) {
      args.push(`--target=${options.target}`);
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 300000
    };

    return await this.commandExecutor.executeDDEV('import-files', args, execOptions);
  }

  /**
   * Run DDEV debug commands
   */
  async debug(options: DDEVCommandOptions & {
    command?: string;
  }): Promise<CommandResult> {
    this.logger.info('Running DDEV debug command', {
      command: options.command,
      projectPath: options.projectPath
    });

    const args: string[] = [];

    if (options.command) {
      args.push(options.command);
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('debug', args, execOptions);
  }

  /**
   * Execute command in DDEV container with intelligent service routing
   */
  async exec(options: DDEVCommandOptions & {
    command: string;
    service?: string;
    workdir?: string;
  }): Promise<CommandResult> {
    // Smart service routing based on command
    let targetService = options.service || 'web';

    if (!options.service) {
      const cmd = options.command.toLowerCase();

      // Auto-route to appropriate service
      if (cmd.startsWith('redis-cli') || cmd.includes('redis')) {
        targetService = 'redis';
      } else if (cmd.startsWith('mysql') || cmd.startsWith('mariadb') || cmd.includes('mysqldump')) {
        targetService = 'db';
      } else if (cmd.startsWith('solr') || cmd.includes('solr')) {
        targetService = 'solr';
      }
      // drush, composer, npm, php, etc. stay on 'web' (default)
    }

    this.logger.info('Executing command in DDEV container', {
      command: options.command,
      originalService: options.service,
      targetService,
      autoRouted: !options.service && targetService !== 'web',
      projectPath: options.projectPath
    });

    const args: string[] = [];

    args.push(`--service=${targetService}`);
    if (options.workdir) args.push(`--workdir=${options.workdir}`);

    args.push(options.command);

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('exec', args, execOptions);
  }

  /**
   * Share project via ngrok
   */
  async share(options: DDEVCommandOptions & {
    ngrokArgs?: string;
  }): Promise<CommandResult> {
    this.logger.info('Sharing DDEV project via ngrok', {
      projectPath: options.projectPath
    });

    const args: string[] = [];

    if (options.ngrokArgs) {
      args.push(...options.ngrokArgs.split(' '));
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('share', args, execOptions);
  }

  /**
   * Manage hostfile entries
   */
  async hostname(options: DDEVCommandOptions & {
    action?: 'add' | 'remove' | 'list';
    hostname?: string;
  }): Promise<CommandResult> {
    const action = options.action || 'list';

    this.logger.info('Managing hostfile entries', {
      action,
      hostname: options.hostname,
      projectPath: options.projectPath
    });

    const args: string[] = [];

    switch (action) {
      case 'add':
        args.push('add');
        if (options.hostname) args.push(options.hostname);
        break;
      case 'remove':
        args.push('remove');
        if (options.hostname) args.push(options.hostname);
        break;
      case 'list':
      default:
        args.push('list');
        break;
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('hostname', args, execOptions);
  }

  /**
   * Power off all DDEV projects
   */
  async poweroff(options: { timeout?: number } = {}): Promise<CommandResult> {
    this.logger.info('Powering off all DDEV projects');

    const execOptions = {
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('poweroff', [], execOptions);
  }

  /**
   * Get help information for DDEV commands
   */
  async help(options: DDEVCommandOptions & { command?: string }): Promise<CommandResult> {
    this.logger.info('Getting DDEV help information', {
      command: options.command,
      projectPath: options.projectPath
    });

    const args: string[] = ['help'];

    if (options.command) {
      args.push(options.command);
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    // For help command, we need to use ddev directly, not executeDDEV
    const command = options.command ? `ddev help ${options.command}` : 'ddev help';

    return await this.commandExecutor.execute(command, execOptions);
  }

  /**
   * Get DDEV version information
   */
  async version(options: { timeout?: number } = {}): Promise<CommandResult> {
    this.logger.info('Getting DDEV version information');

    const execOptions = {
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('version', [], execOptions);
  }

  /**
   * Navigate to a DDEV project directory and verify it's valid
   * Note: This sets the working directory for all subsequent DDEV commands
   */
  async changeDirectory(options: {
    path: string;
    verify?: boolean;
    timeout?: number;
  }): Promise<CommandResult> {
    this.logger.info('Navigating to DDEV project directory', {
      path: options.path,
      verify: options.verify
    });

    const startTime = Date.now();

    try {
      // Resolve the path (handle ~ and relative paths)
      const resolvedPath = options.path.replace('~', process.env.HOME || '~');

      // Check if directory exists
      const fs = await import('fs');
      const path = await import('path');

      if (!fs.existsSync(resolvedPath)) {
        const duration = Date.now() - startTime;
        return {
          success: false,
          output: '',
          error: `Directory does not exist: ${resolvedPath}`,
          exitCode: 1,
          duration
        };
      }

      // Check if it's a directory
      const stat = fs.statSync(resolvedPath);
      if (!stat.isDirectory()) {
        const duration = Date.now() - startTime;
        return {
          success: false,
          output: '',
          error: `Path is not a directory: ${resolvedPath}`,
          exitCode: 1,
          duration
        };
      }

      // Test cd command to verify path works (preserves symlinks)
      const cdResult = await this.commandExecutor.execute(`cd "${resolvedPath}" && pwd`, {
        timeout: options.timeout || 30000
      });

      if (!cdResult.success) {
        const duration = Date.now() - startTime;
        return {
          success: false,
          output: '',
          error: `Failed to navigate to directory: ${cdResult.error}`,
          exitCode: cdResult.exitCode,
          duration
        };
      }

      // Get the symlink-preserved path from cd + pwd
      const symlinkPath = cdResult.output.trim();

      // Set this as the default project path for subsequent operations
      this.setDefaultProjectPath(symlinkPath);

      let output = `Navigated to DDEV project directory: ${resolvedPath}\n`;
      output += `Symlink-preserved path: ${symlinkPath}\n`;
      output += `Default project path set for subsequent operations\n`;

      // Verify it's a DDEV project if requested
      if (options.verify !== false) {
        const ddevConfigPath = path.join(resolvedPath, '.ddev', 'config.yaml');

        if (fs.existsSync(ddevConfigPath)) {
          // Try to get DDEV project info using the symlink path
          try {
            const statusResult = await this.commandExecutor.executeDDEV('status', [], {
              cwd: symlinkPath, // Use the symlink path
              timeout: options.timeout || 30000
            });

            if (statusResult.success) {
              output += '\n✅ Valid DDEV project detected\n';
              output += statusResult.output;
            } else {
              output += '\n⚠️  DDEV project found but may not be running\n';
              output += statusResult.output;
            }
          } catch (error) {
            output += '\n⚠️  DDEV project found but status check failed\n';
            output += `Error: ${error instanceof Error ? error.message : String(error)}\n`;
          }
        } else {
          output += '\n❌ No DDEV configuration found (.ddev/config.yaml missing)\n';
          output += 'This directory does not appear to be a DDEV project.\n';
        }
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        output,
        exitCode: 0,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        output: '',
        error: `Failed to navigate to project directory: ${error instanceof Error ? error.message : String(error)}`,
        exitCode: 1,
        duration
      };
    }
  }

  // Add-on and service-specific operations

  /**
   * Execute Redis CLI commands using native ddev redis-cli command (AI-friendly, non-interactive)
   */
  async redisCli(options: DDEVCommandOptions & {
    command?: string;
  }): Promise<CommandResult> {
    this.logger.info('Executing Redis CLI command', {
      command: options.command,
      projectPath: options.projectPath
    });

    // Default to INFO command if no command specified (useful for AI)
    const redisCommand = options.command || 'INFO';

    // Use native ddev redis-cli command (automatically runs in redis container)
    const args: string[] = redisCommand.split(' ');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('redis-cli', args, execOptions);
  }

  /**
   * Get Redis server information using native ddev redis-cli (AI-friendly)
   */
  async redisInfo(options: DDEVCommandOptions & {
    section?: string;
  }): Promise<CommandResult> {
    this.logger.info('Getting Redis server information', {
      section: options.section,
      projectPath: options.projectPath
    });

    const args: string[] = ['INFO'];

    if (options.section) {
      args.push(options.section);
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.executeDDEV('redis-cli', args, execOptions);
  }

  /**
   * Execute native DDEV Solr commands
   */
  async solr(options: DDEVCommandOptions & {
    command?: string;
  }): Promise<CommandResult> {
    const command = options.command || 'status';

    this.logger.info('Executing DDEV Solr command', {
      command,
      projectPath: options.projectPath
    });

    const args: string[] = command.split(' ');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('solr', args, execOptions);
  }

  /**
   * Execute DDEV Solr ZooKeeper commands
   */
  async solrZk(options: DDEVCommandOptions & {
    command?: string;
  }): Promise<CommandResult> {
    const command = options.command || 'ls /collections';

    this.logger.info('Executing DDEV Solr ZooKeeper command', {
      command,
      projectPath: options.projectPath
    });

    const args: string[] = command.split(' ');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('solr-zk', args, execOptions);
  }

  /**
   * Execute MySQL/MariaDB commands using native ddev mysql command
   */
  async mysql(options: DDEVCommandOptions & {
    query?: string;
    database?: string;
  }): Promise<CommandResult> {
    const query = options.query || 'SHOW DATABASES';
    const database = options.database || 'db';

    this.logger.info('Executing MySQL command', {
      query,
      database,
      projectPath: options.projectPath
    });

    // Use echo to pipe SQL to ddev mysql (proper stdin usage)
    const command = `echo "${query};" | ddev mysql ${database}`;

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 30000
    };

    return await this.commandExecutor.execute(command, execOptions);
  }

  /**
   * Execute Platform.sh CLI commands
   * REQUIRES USER CONFIRMATION for safety
   */
  async platform(options: DDEVCommandOptions & {
    command?: string;
  }): Promise<CommandResult> {
    const command = options.command || 'environment:list';

    this.logger.info('Executing Platform.sh command', {
      command,
      projectPath: options.projectPath
    });

    const args: string[] = command.split(' ');

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('platform', args, execOptions);
  }

  /**
   * Execute Playwright commands (AI-friendly, non-interactive)
   */
  async playwright(options: DDEVCommandOptions & {
    action?: string;
    testFilter?: string;
    browser?: string;
    headed?: boolean;
  }): Promise<CommandResult> {
    const action = options.action || 'version';

    this.logger.info('Executing Playwright command', {
      action,
      testFilter: options.testFilter,
      projectPath: options.projectPath
    });

    const args: string[] = ['playwright'];

    switch (action) {
      case 'test':
        args.push('test');
        if (options.testFilter) {
          args.push(options.testFilter);
        }
        if (options.headed) {
          args.push('--headed');
        }
        if (options.browser) {
          args.push(`--project=${options.browser}`);
        }
        // Add non-interactive flags for AI usage
        args.push('--reporter=json');
        break;
      case 'install':
        args.push('install');
        break;
      case 'show-report':
        args.push('show-report', '--host=0.0.0.0');
        break;
      case 'list-browsers':
        args.push('install', '--dry-run');
        break;
      case 'version':
      default:
        args.push('--version');
        break;
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('exec', args, execOptions);
  }

  /**
   * Install Playwright browsers and dependencies
   */
  async playwrightInstall(options: DDEVCommandOptions & {
    browser?: string;
    withDeps?: boolean;
  }): Promise<CommandResult> {
    this.logger.info('Installing Playwright browsers', {
      browser: options.browser,
      withDeps: options.withDeps,
      projectPath: options.projectPath
    });

    const args: string[] = ['playwright', 'install'];

    if (options.browser) {
      args.push(options.browser);
    }

    if (options.withDeps) {
      args.push('--with-deps');
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 300000
    };

    return await this.commandExecutor.executeDDEV('exec', args, execOptions);
  }

  // Enhanced WordPress operations

  /**
   * Comprehensive WordPress plugin management
   */
  async wpPluginManage(options: DDEVCommandOptions & {
    action: string;
    plugin?: string;
    version?: string;
    activate?: boolean;
    force?: boolean;
    all?: boolean;
  }): Promise<CommandResult> {
    this.logger.info('Managing WordPress plugin', {
      action: options.action,
      plugin: options.plugin,
      projectPath: options.projectPath
    });

    const args: string[] = ['plugin', options.action];

    if (options.plugin) {
      args.push(options.plugin);
    }

    if (options.version && (options.action === 'install')) {
      args.push(`--version=${options.version}`);
    }

    if (options.activate && (options.action === 'install')) {
      args.push('--activate');
    }

    if (options.force && ['install', 'update'].includes(options.action)) {
      args.push('--force');
    }

    if (options.all && options.action === 'update') {
      args.push('--all');
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Comprehensive WordPress theme management
   */
  async wpThemeManage(options: DDEVCommandOptions & {
    action: string;
    theme?: string;
    version?: string;
    activate?: boolean;
    force?: boolean;
  }): Promise<CommandResult> {
    this.logger.info('Managing WordPress theme', {
      action: options.action,
      theme: options.theme,
      projectPath: options.projectPath
    });

    const args: string[] = ['theme', options.action];

    if (options.theme) {
      args.push(options.theme);
    }

    if (options.version && (options.action === 'install')) {
      args.push(`--version=${options.version}`);
    }

    if (options.activate && (options.action === 'install')) {
      args.push('--activate');
    }

    if (options.force && ['install', 'update'].includes(options.action)) {
      args.push('--force');
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 120000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * WordPress user management operations
   */
  async wpUserManage(options: DDEVCommandOptions & {
    action: string;
    user?: string;
    userLogin?: string;
    userEmail?: string;
    userPass?: string;
    role?: string;
    displayName?: string;
  }): Promise<CommandResult> {
    this.logger.info('Managing WordPress user', {
      action: options.action,
      user: options.user,
      projectPath: options.projectPath
    });

    const args: string[] = ['user', options.action];

    if (options.user) {
      args.push(options.user);
    }

    // Handle create action parameters
    if (options.action === 'create') {
      if (options.userLogin) args.push(options.userLogin);
      if (options.userEmail) args.push(options.userEmail);
      if (options.userPass) args.push(`--user_pass=${options.userPass}`);
      if (options.role) args.push(`--role=${options.role}`);
      if (options.displayName) args.push(`--display_name="${options.displayName}"`);
    }

    // Handle reset-password action
    if (options.action === 'reset-password' && options.userPass) {
      args.push(`--user_pass=${options.userPass}`);
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * WordPress maintenance and cache operations
   */
  async wpMaintenance(options: DDEVCommandOptions & {
    action: string;
    enable?: boolean;
  }): Promise<CommandResult> {
    this.logger.info('WordPress maintenance operation', {
      action: options.action,
      projectPath: options.projectPath
    });

    let args: string[] = [];

    switch (options.action) {
      case 'cache-flush':
        args = ['cache', 'flush'];
        break;
      case 'rewrite-flush':
        args = ['rewrite', 'flush'];
        break;
      case 'cron-run':
        args = ['cron', 'event', 'run', '--due-now'];
        break;
      case 'cron-list':
        args = ['cron', 'event', 'list'];
        break;
      case 'maintenance-mode':
        args = ['maintenance-mode'];
        if (options.enable !== undefined) {
          args.push(options.enable ? 'activate' : 'deactivate');
        } else {
          args.push('status');
        }
        break;
      default:
        throw new Error(`Unknown maintenance action: ${options.action}`);
    }

    const execOptions = {
      cwd: options.projectPath,
      timeout: options.timeout || 60000
    };

    return await this.commandExecutor.executeDDEV('wp', args, execOptions);
  }

  /**
   * Request user input with optional predefined options
   */
  async requestUserInput(options: {
    message: string;
    options?: string[];
    timeout?: number;
  }): Promise<CommandResult> {
    const { message, options: userOptions = [], timeout = 30 } = options;

    this.logger.info('Requesting user input', { message, options: userOptions, timeout });

    const { getUserInput } = await import('../utils/userInput.js');

    const startTime = Date.now();
    const result = await getUserInput({
      message,
      options: userOptions,
      timeout
    });
    const duration = Date.now() - startTime;

    if (result.success && result.response) {
      return {
        success: true,
        output: `User input: ${result.response}`,
        error: undefined,
        exitCode: 0,
        duration
      };
    } else if (result.timedOut) {
      return {
        success: false,
        output: 'User did not reply: Timeout occurred.',
        error: 'User input timeout',
        exitCode: 1,
        duration
      };
    } else {
      return {
        success: false,
        output: 'User input failed',
        error: result.error || 'Unknown error',
        exitCode: 1,
        duration
      };
    }
  }

  /**
   * Send a notification to the user
   */
  async sendNotification(options: {
    title: string;
    message: string;
  }): Promise<CommandResult> {
    const { title, message } = options;

    this.logger.info('Sending notification', { title, message });

    try {
      // Try to use node-notifier for system notifications
      const notifier = await import('node-notifier').catch(() => null);

      if (notifier) {
        notifier.default.notify({
          title,
          message,
          timeout: 15, // 15 seconds - longer for important notifications
        });
      } else {
        // Fallback to console notification
        console.log(`\n🔔 ${title}: ${message}\n`);
      }

      const notificationText = `NOTIFICATION: ${title}\n${message}`;
      return {
        success: true,
        output: notificationText,
        error: undefined,
        exitCode: 0,
        duration: 0
      };
    } catch (error) {
      // Fallback to console if notification fails
      console.log(`\n🔔 ${title}: ${message}\n`);

      const notificationText = `NOTIFICATION: ${title}\n${message}`;
      return {
        success: true,
        output: notificationText,
        error: undefined,
        exitCode: 0,
        duration: 0
      };
    }
  }

}
