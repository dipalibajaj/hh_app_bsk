import winston from 'winston';

declare global {
  var logger: typeof winston.Logger;
}
