import { Router, Request, Response } from 'express';
import apiResponses from 'node-common-utils/dist/api/api.responses';
import asyncHandler from 'node-common-utils/dist/api/async.handler';

export default (app: Router) => {
  app.get(
    '/health',
    asyncHandler(async (_req: Request, res: Response) => {
      return new apiResponses.SuccessResponse({
        name: 'API Service',
        status: true,
        date: new Date().toISOString(),
        upTime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        platform: process.platform,
      }).send(res);
    }),
  );
};
