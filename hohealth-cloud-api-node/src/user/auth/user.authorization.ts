import express from 'express';
import { User } from 'hohealth-db-node/dist/user/user.model';
import db from 'hohealth-db-node/dist/';
import apiErrors from 'node-common-utils/dist/api/api.errors';
import asyncHandler from 'node-common-utils/dist/api/async.handler';

export function _assertCurrentUserExists(req: express.Request): User {
  if (!req.currentUser.user)
    throw new apiErrors.AuthFailureError(
      `Current User does not exist in Database, Make sure the authenticated user is registered`,
      'Current User Does not exist',
    );
  return req.currentUser.user;
}

export async function _assertUserDataExists(uid: any): Promise<User> {
  if (!uid || typeof uid !== 'string')
    throw new apiErrors.BadRequestError(
      'uid must be passed in the request parameters',
      'Invalid Request',
    );
  const user = await db.userRepository.getUserById(uid as string);
  if (!user)
    throw new apiErrors.NotFoundError(
      `User with id = ${uid} not found`,
      'User not found!',
    );
  return user;
}

/**
 * This checks if the user is authenticated, but the user may not be in the database.
 */
const signedIn = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    if (!req.currentUser.decodedToken)
      throw new apiErrors.AuthFailureError(`Current user is not signed In`);

    return next();
  },
);

/**
 * This checks if the authenticated user exists in the database.
 */
const currentUserExists = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    _assertCurrentUserExists(req);
    return next();
  },
);

/**
 * This checks if the requested user exists in the database.
 */
const requestedUserExists = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    _assertCurrentUserExists(req);
    const user = await _assertUserDataExists(req.query.uid);
    req.requestedUser.user = user;
    return next();
  },
);

/**
 * This checks if the authenticated user is user is accessing their own records.
 */
const isCurrentUser = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    const currentUser = _assertCurrentUserExists(req);
    const requestedUser = await _assertUserDataExists(req.query.uid);
    if (requestedUser._id !== currentUser._id)
      throw new apiErrors.ForbiddenError(
        'Only the [current] user can perform this operation',
      );

    req.requestedUser.user = requestedUser;
    return next();
  },
);

/**
 * This checks if the user is accessing their own records or the user has dataViewer permission.
 */
const isCurrentUserOrCanReadData = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    const currentUser = _assertCurrentUserExists(req);
    const requestedUser = await _assertUserDataExists(req.query.uid);
    if (
      requestedUser._id !== currentUser._id &&
      req.rights.isAdmin !== true &&
      req.rights.isDataViewer !== true &&
      req.rights.isDataManager !== true
    )
      throw new apiErrors.ForbiddenError(
        'Only the [current | admin | dataManager | dataViewer] user can perform this operation',
      );

    req.requestedUser.user = requestedUser;
    return next();
  },
);

/**
 * This checks if the user is accessing their own records or the user has dataManager permission.
 */
const isCurrentUserOrCanWriteData = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    const currentUser = _assertCurrentUserExists(req);
    const requestedUser = await _assertUserDataExists(req.query.uid);
    if (
      requestedUser._id !== currentUser._id &&
      req.rights.isAdmin !== true &&
      req.rights.isDataManager !== true
    )
      throw new apiErrors.ForbiddenError(
        'Only the [current | admin | dataManager] user can perform this operation',
      );

    req.requestedUser.user = requestedUser;
    return next();
  },
);

/**
 * This checks if the user is accessing their own records or the user has dataManager permission.
 */
const isCurrentUserOrAdmin = asyncHandler(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    const currentUser = _assertCurrentUserExists(req);
    const requestedUser = await _assertUserDataExists(req.query.uid);
    if (requestedUser._id !== currentUser._id && req.rights.isAdmin !== true)
      throw new apiErrors.ForbiddenError(
        'Only the [current | admin ] user can perform this operation',
      );

    req.requestedUser.user = requestedUser;
    return next();
  },
);

export default {
  signedIn,
  currentUserExists,
  requestedUserExists,
  isCurrentUser,
  isCurrentUserOrCanReadData,
  isCurrentUserOrCanWriteData,
  isCurrentUserOrAdmin,
};
