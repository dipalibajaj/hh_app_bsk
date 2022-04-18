import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import config from './config';
import DailyRotateFile from 'winston-daily-rotate-file';
import morgan from 'morgan';
import { Application } from 'express';

const logFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `${timestamp} [${label ?? 'server'}] ${level}: ${message}`;
  },
);
/**
 * Winston Logger formatting for File Logs
 */
const fileLogFormat = winston.format.combine(
  logFormat,
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.json(),
);

/**
 * Winston Logger formatting for Console Logs
 */
const consoleLogFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.splat(),
  winston.format.timestamp({format: "DD-MM-YY HH:mm:ss:SSS"}),
  logFormat,
);

/**
 * Winston Logger Instance
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: fileLogFormat,
  exitOnError: false,
});
global.logger = logger;

// add console log transport
logger.add(new winston.transports.Console({ format: consoleLogFormat }));

//using the logger and its configured transports, to save the logs created by Morgan
const _apiStreamForMorgan = {
  write: (text: string) =>
    logger.log({ level: 'info', message: text, label: 'API' }),
};

/**
 * Call this to set up the logger for the application
 * @param app The express application
 */
export function setupLogging(app: Application) {
  app.use(morgan('dev', { stream: _apiStreamForMorgan }));

  if (config.isProd) {
    logger.add(new LoggingWinston({ level: 'warn' }));
  } else {
    logger.add(
      new DailyRotateFile({
        dirname: 'logs',
        filename: config.logging.fileName,
        extension: '.log',
        maxSize: config.logging.fileSize,
        maxFiles: config.logging.fileRotationInterval,
        zippedArchive: config.logging.compressRotatedFiles,
      }),
    );
  }
}
