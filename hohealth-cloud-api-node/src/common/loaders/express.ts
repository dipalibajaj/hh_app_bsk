import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from '../routes';
import apiErrors from 'node-common-utils/dist/api/api.errors';
import auth from '../../auth';

export default ({
  app,
  isStarting = true,
}: {
  app: express.Application;
  isStarting?: boolean;
}) => {
  if (isStarting) {
    logger.info('🚅 Loading Express...');
    app.use(helmet());
    app.use(cors());

    // Middleware that transforms the raw string of req.body into json
    app.use(express.json());

    //Initialises the Firebase App
    auth.init();

    // Load API routes
    app.use(routes());

    ///Set a standard error if the API is not available
    app.use((_req: Request, _res: Response, next: NextFunction) =>
      next(
        new apiErrors.NotFoundError(
          'Resource Requested does not exist on Server',
          'Invalid Request from Client',
        ),
      ),
    );

    // Middleware Error Handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof apiErrors.ApiError) {
        logger.error(`ApiError Occurred: ${err.debugMessage}`);
        apiErrors.ApiError.handle(err, res);
      } else {
        logger.error(`Unhandled Exception Occurred: ${err.message} \n${err.stack}`);
        apiErrors.ApiError.handle(
          new apiErrors.InternalError(err.message),
          res,
        );
      }
    });

    logger.info('🚅 Express Loaded!');
  }
};
