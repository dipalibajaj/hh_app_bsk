import express from 'express';
import apiErrors from 'node-common-utils/dist/api/api.errors';
import asyncHandler from 'node-common-utils/dist/api/async.handler';

/**
 * This check if the user has admin rights.
 */
const isUserAdmin = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    if (req.rights.isAdmin !== true)
      throw new apiErrors.ForbiddenError(
        'The user does not have the [admin] rights to access this content',
      );
    return next();
  },
);

/**
 * This check if the user has dataViewer rights.
 */
const isUserDataViewer = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    if (
      req.rights.isAdmin !== true &&
      req.rights.isDataManager !== true &&
      req.rights.isDataViewer !== true
    )
      throw new apiErrors.ForbiddenError(
        'The user does not have the [admin | dataViewer | dataManager] rights to access this content',
      );
    return next();
  },
);

/**
 * This check if the user has dataManager rights.
 */
const isUserDataManager = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    if (req.rights.isAdmin !== true && req.rights.isDataManager !== true)
      throw new apiErrors.ForbiddenError(
        'The user does not have the [admin | dataManager] rights to access this content',
      );
    return next();
  },
);

export default {
  isUserAdmin,
  isUserDataViewer,
  isUserDataManager,
};
