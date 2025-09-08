/**
 * Logger utility for DDEV MCP Server
 * Provides structured logging with different levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  meta?: Record<string, any>;
}

export class Logger {
  private context: string;
  private logLevel: LogLevel;

  constructor(context: string, logLevel: LogLevel = LogLevel.WARN) {
    this.context = context;
    this.logLevel = logLevel;
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    if (level < this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      meta
    };

    const levelName = LogLevel[level];
    const output = `[${entry.timestamp}] [${levelName}] [${this.context}] ${message}`;

    if (meta && Object.keys(meta).length > 0) {
      if (level >= LogLevel.ERROR) {
        console.error(output, meta);
      } else if (level >= LogLevel.WARN) {
        console.warn(output, meta);
      } else {
        console.log(output, meta);
      }
    } else {
      if (level >= LogLevel.ERROR) {
        console.error(output);
      } else if (level >= LogLevel.WARN) {
        console.warn(output);
      } else {
        console.log(output);
      }
    }
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  child(childContext: string): Logger {
    return new Logger(`${this.context}:${childContext}`, this.logLevel);
  }
}
