import config from './common/config';
import express from 'express';
import http from 'http';
import loaders from './common/loaders';
import { setupLogging } from './common/logging';

async function startServer() {
  try {
    logger.info('⌛ Starting Server...');
    const app = express();
    const server = http.createServer(app);
    //Setup Logging
    setupLogging(app);

    //Loading components
    await loaders({ expressApp: app });

    //Listening to port
    server
      .listen(config.port, () => {
        logger.debug(`🔥  Server listening on port: ${config.port}  🔥`);
      })
      .on('error', err => {
        logger.error(`❌ Failed to Listen to Port ${config.port} ❌`, err);
      });

    //Graceful shutdown
    process.on('SIGTERM', async () => {
      await handleProcessTermination(server);
    });
    process.on('SIGINT', async () => {
      await handleProcessTermination(server);
    });
    process.once('SIGUSR2', async () => {
      await handleProcessTermination(server);
    });
  } catch (error) {
    logger.error(`❌ Failed to Load Application. ❌`);
    logger.error(error);
    await handleProcessTermination();
  }
}

async function handleProcessTermination(server?: http.Server) {
  logger.info(`🚧  Server is shutting down...`);
  await loaders({ isStarting: false });
  server?.close(() => {
    logger.info('🚅 Express Server Shutting Down...');
  });
}

startServer();
