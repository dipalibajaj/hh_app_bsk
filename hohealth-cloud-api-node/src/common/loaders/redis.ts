import redis from 'node-common-utils/dist/redis/';

export default async (connect: boolean = true) => {
  if (connect) {
    logger.info('🚩 Connecting to Redis...');
    redis.cache.on('ready', () => {
      logger.info('🚩 Redis Ready....');
    });
    redis.cache.on('reconnecting', () => {
      logger.info('🚩 Redis Reconnecting....');
    });
    redis.cache.on('error', error => {
      logger.info('🚩 Redis Error!', error);
    });
    redis.cache.on('end', () => {
      logger.info('🚩 Redis Disconnected!');
    });

    redis.pub.on('ready', () => {
      logger.info('🚩 Redis Publisher Client Ready....');
    });
    redis.pub.on('reconnecting', () => {
      logger.info('🚩 Redis Publisher Client Reconnecting....');
    });
    redis.pub.on('error', error => {
      logger.info('🚩 Redis Publisher Client Error!', error);
    });
    redis.pub.on('end', () => {
      logger.info('🚩 Redis Publisher Client Disconnected!');
    });

    redis.sub.on('ready', () => {
      logger.info('🚩 Redis Subscriber Client Ready....');
    });

    redis.sub.on('reconnecting', () => {
      logger.info('🚩 Redis Subscriber Client Reconnecting....');
    });
    redis.sub.on('error', error => {
      logger.info('🚩 Redis Subscriber Client Error!', error);
    });
    redis.sub.on('end', () => {
      logger.info('🚩 Redis Subscriber Client Disconnected!');
    });
  } else {
    logger.info('⚡ Closing Redis Connection...');
    try {
      await redis.cache.quit();
      await redis.pub.quit();
      await redis.sub.quit();
    } catch (e) {}
  }
};
