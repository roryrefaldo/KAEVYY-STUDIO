/**
 * KAEVY STUDIO - Centralized RuntimeManager
 * Phase 10.2 Production Lifecycle Management & Graceful Shutdown
 */

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { validateEnvironment } from '../utils/envValidator.js';
import { logger } from '../utils/logger.js';
import { dbManager } from './dbManager.js';
import { redisManager } from './redisManager.js';
import { storageManager } from './storageManager.js';
import { WorkerRegistry } from '../workers/workerRegistry.js';
import { schedulerManager } from '../scheduler/schedulerManager.js';

export class RuntimeManager {
  private httpServer: HttpServer | null = null;
  private socketServer: SocketIOServer | null = null;
  private isShuttingDown = false;

  public async initialize(): Promise<void> {
    logger.info('=====================================================');
    logger.info('   KAEVY STUDIO - Production Cloud Runtime Startup   ');
    logger.info('=====================================================');

    // 1. Validate environment configuration
    validateEnvironment();

    // 2. Database readiness check
    const dbStatus = await dbManager.checkHealth();
    logger.info(`PostgreSQL/Cloud SQL status: ${dbStatus.status}`, { latencyMs: dbStatus.latencyMs });

    // 3. Redis check
    const redisStatus = await redisManager.ping();
    logger.info(`Redis Runtime status: ${redisStatus.status}`, { mode: redisStatus.mode });

    // 4. Storage Provider check
    const storageStatus = await storageManager.checkHealth();
    logger.info(`Storage Manager initialized`, { provider: storageStatus.provider, bucket: storageStatus.bucket });

    // 5. Initialize Background Queue Workers & Scheduler Manager
    WorkerRegistry.initializeAllWorkers();
    schedulerManager.start();
  }

  public registerServerInstances(httpServer: HttpServer, socketServer?: SocketIOServer): void {
    this.httpServer = httpServer;
    if (socketServer) {
      this.socketServer = socketServer;
    }
  }

  public setupGracefulShutdown(): void {
    const handleSignal = (signal: string) => {
      logger.info(`Received signal ${signal}. Initiating graceful shutdown sequence...`);
      this.gracefulShutdown(signal);
    };

    process.on('SIGTERM', () => handleSignal('SIGTERM'));
    process.on('SIGINT', () => handleSignal('SIGINT'));

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception detected in runtime process', err);
      this.gracefulShutdown('uncaughtException', 1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection detected in runtime process', reason);
    });
  }

  public async gracefulShutdown(signal: string, exitCode = 0): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn('Shutdown already in progress. Ignoring duplicate trigger.');
      return;
    }
    this.isShuttingDown = true;

    logger.info(`[Shutdown Sequence] Step 1: Stop accepting new HTTP requests...`);
    if (this.httpServer) {
      await new Promise<void>((resolve) => {
        this.httpServer?.close((err) => {
          if (err) {
            logger.error('Error closing HTTP server', err);
          } else {
            logger.info('[Shutdown Sequence] HTTP server closed successfully.');
          }
          resolve();
        });
      });
    }

    logger.info(`[Shutdown Sequence] Step 2: Closing Socket.IO real-time channels & Background Workers...`);
    WorkerRegistry.stopAllWorkers();
    schedulerManager.stop();
    if (this.socketServer) {
      try {
        this.socketServer.close();
        logger.info('[Shutdown Sequence] Socket.IO server closed.');
      } catch (err: any) {
        logger.error('Error closing Socket.IO server', err);
      }
    }

    logger.info(`[Shutdown Sequence] Step 3: Disconnecting PostgreSQL connection pool...`);
    await dbManager.disconnect();

    logger.info(`[Shutdown Sequence] Step 4: Disconnecting Redis runtime client...`);
    await redisManager.disconnect();

    logger.info(`[Shutdown Sequence] Step 5: Flush logs & terminate process.`);
    setTimeout(() => {
      process.exit(exitCode);
    }, 200);
  }
}

export const runtimeManager = new RuntimeManager();
