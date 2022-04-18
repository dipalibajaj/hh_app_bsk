require('dotenv').config();

export default {
  port: process.env.PORT ?? 8080,
  isProd: (process.env.NODE_ENV ?? 'production') === 'production',
  isTesting: (process.env.NODE_ENV ?? 'production') === 'test',
  logging: {
    level: process.env.LOG_LEVEL!!,
    fileName: process.env.LOG_FILE!!,
    fileSize: process.env.LOG_FILE_SIZE!!,
    fileRotationInterval: process.env.LOG_FILE_ROTATION_INTERVAL!!,
    compressRotatedFiles: (process.env.LOG_COMPRESS_FILE ?? 'false') === 'true',
  },
  firebase: {
    webApiKey: process.env.FIREBASE_WEB_API_KEY!!,
    databaseUrl: process.env.FIREBASE_DATABASE_URL!!,
    adminCertificate: process.env.FIREBASE_ADMIN_CERT!!,
  },
  orm: {
    url: process.env.DB_URI!!,
  },
  testing: {
    isAdmin: (process.env.IS_ADMIN ?? 'false') === 'true',
    isDataManager: (process.env.IS_DATA_MANAGER ?? 'false') === 'true',
    isDataViewer: (process.env.IS_DATA_VIEWER ?? 'false') === 'true',
  },
  redis: {
    url: process.env.REDIS_URL!!,
    ttl: parseInt(process.env.REDIS_CACHE_TTL!!),
    debug: (process.env.REDIS_DEBUG ?? 'false') === 'true',
  },
  secretKey: process.env.SECRET_KEY!!,
};
