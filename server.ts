import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { app } from './src/server/app.js';
import { initSocketServer } from './src/server/socket/socketServer.js';
import { runtimeManager } from './src/server/runtime/runtimeManager.js';
import { logger } from './src/server/utils/logger.js';

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  
  // 1. Initialize Centralized Runtime Manager
  await runtimeManager.initialize();

  const httpServer = http.createServer(app);

  // 2. Initialize Real-Time Socket.IO Server
  const io = initSocketServer(httpServer);

  // 3. Register server instances with RuntimeManager for lifecycle & graceful shutdown
  runtimeManager.registerServerInstances(httpServer, io);
  runtimeManager.setupGracefulShutdown();

  // 4. Vite middleware for development vs static dist serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    logger.info(`KAEVY STUDIO API Server & Real-Time Socket.IO listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  logger.error('Fatal error starting server', err);
  process.exit(1);
});
