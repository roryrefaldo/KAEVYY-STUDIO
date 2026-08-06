/**
 * KAEVY STUDIO - Production Structured JSON Logger
 * Phase 10.2 Runtime Hardening
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  environment: string;
  requestId?: string;
  meta?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private serviceName = 'kaevy-studio-api';

  private get environment(): string {
    return process.env.NODE_ENV || 'development';
  }

  private isProduction(): boolean {
    return this.environment === 'production';
  }

  private formatEntry(level: LogLevel, message: string, meta?: Record<string, any>, err?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      environment: this.environment,
    };

    if (meta) {
      if (meta.requestId) {
        entry.requestId = meta.requestId;
        const { requestId, ...restMeta } = meta;
        if (Object.keys(restMeta).length > 0) {
          entry.meta = restMeta;
        }
      } else {
        entry.meta = meta;
      }
    }

    if (err) {
      entry.error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    }

    return entry;
  }

  public info(message: string, meta?: Record<string, any>): void {
    const entry = this.formatEntry('info', message, meta);
    if (this.isProduction()) {
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[${entry.timestamp}] INFO (${entry.service}): ${message}`, meta || '');
    }
  }

  public warn(message: string, meta?: Record<string, any>): void {
    const entry = this.formatEntry('warn', message, meta);
    if (this.isProduction()) {
      console.warn(JSON.stringify(entry));
    } else {
      console.warn(`[${entry.timestamp}] WARN (${entry.service}): ${message}`, meta || '');
    }
  }

  public error(message: string, err?: Error | any, meta?: Record<string, any>): void {
    const errorObj = err instanceof Error ? err : undefined;
    const combinedMeta = meta || (err && !(err instanceof Error) ? err : undefined);
    const entry = this.formatEntry('error', message, combinedMeta, errorObj);

    if (this.isProduction()) {
      console.error(JSON.stringify(entry));
    } else {
      console.error(`[${entry.timestamp}] ERROR (${entry.service}): ${message}`, errorObj?.stack || errorObj || combinedMeta || '');
    }
  }

  public debug(message: string, meta?: Record<string, any>): void {
    if (!this.isProduction()) {
      const entry = this.formatEntry('debug', message, meta);
      console.debug(`[${entry.timestamp}] DEBUG (${entry.service}): ${message}`, meta || '');
    }
  }
}

export const logger = new Logger();
