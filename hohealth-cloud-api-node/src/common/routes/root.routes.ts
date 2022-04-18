import { Router, Request, Response } from 'express';
import auth from '../../auth';
import apiResponses from 'node-common-utils/dist/api/api.responses';
import asyncHandler from 'node-common-utils/dist/api/async.handler';
import redisClient from 'node-common-utils/dist/redis';
const route = Router();

export default (app: Router) => {
  app.use('/', route);
  //Use authentication for all requests
  route.get('/', auth.authentication, (_req: Request, res: Response) => {
    return new apiResponses.SuccessResponse({ authenticated: true }).send(res);
  });

  route.get(
    '/currentExists',
    auth.authentication,
    auth.authorization.user.currentUserExists,
    asyncHandler(async (req: Request, res: Response) => {
      return new apiResponses.SuccessResponse({
        exists: req.currentUser.user !== null,
        id: req.currentUser.user?._id,
      }).send(res);
    }),
  );

  route.get(
    '/exists',
    auth.authentication,
    auth.authorization.user.exists,
    asyncHandler(async (req: Request, res: Response) => {
      return new apiResponses.SuccessResponse({
        exists: req.requestedUser.user !== null,
      }).send(res);
    }),
  );

  route.get(
    '/admin',
    auth.authentication,
    auth.authorization.rights.admin,
    asyncHandler(async (_req: Request, res: Response) => {
      return new apiResponses.SuccessResponse({
        message: 'Congrats You are an Admin',
      }).send(res);
    }),
  );

  route.get(
    '/dataManager',
    auth.authentication,
    auth.authorization.rights.write,
    asyncHandler(async (_req: Request, res: Response) => {
      return new apiResponses.SuccessResponse({
        message: 'Congrats You are an Admin | Data Manager',
      }).send(res);
    }),
  );

  route.get(
    '/dataViewer',
    auth.authentication,
    auth.authorization.rights.read,
    asyncHandler(async (_req: Request, res: Response) => {
      return new apiResponses.SuccessResponse({
        message: 'Congrats You are an Admin | Data Manager | Data Viewer',
      }).send(res);
    }),
  );

  route.get(
    '/flushCache',
    auth.authentication,
    auth.authorization.rights.admin,
    asyncHandler(async (_req: Request, res: Response) => {
      await redisClient.cache.flushall();
      return new apiResponses.SuccessResponse({
        message: 'Flushing Cache',
      }).send(res);
    }),
  );
};
