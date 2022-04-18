import redis from 'node-common-utils/dist/redis';

/**
 * Base class for all Repositories.
 */
export abstract class Repository {
  /**
   * Get Redis TTL in seconds from the config.
   * @returns
   */
  _getCacheTTL(): number {
    return parseInt(process.env.REDIS_CACHE_TTL ?? '600');
  }

  /**
   * Saves the given data to Redis. Without any exceptions.
   * @param key the redis key
   * @param data data to be saved
   * @returns nothing
   */
  async _saveToRedis(key: string, data: any): Promise<void> {
    try {
      await redis.cache.setex(key, this._getCacheTTL(), JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to Redis', error);
      return;
    }
  }

  /**
   * Gets the data from Redis. Without any exceptions.
   * @param key the redis key
   * @returns data from redis; if data does not exist, returns null.
   */
  async _getFromRedis(key: string): Promise<string | null> {
    try {
      return await redis.cache.get(key);
    } catch (error) {
      console.error('Failed to fetch from Redis', error);
      return null;
    }
  }

  /**
   * Removes the given key from Redis. Without any exceptions.
   * @param key to be removed.
   */
  async _removeFromRedis(key: string) {
    try {
      await redis.cache.del(key);
    } catch (error) {
      console.error('Failed to delete from Redis', error);
    }
  }
}
