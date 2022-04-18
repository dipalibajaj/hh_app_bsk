import { Request, Response } from 'express';
import asyncHandler from 'node-common-utils/dist/api/async.handler';
import apiErrors from 'node-common-utils/dist/api/api.errors';
import apiResponses from 'node-common-utils/dist/api/api.responses';
import userSchemas from './user.controller.schemas';
import db from 'hohealth-db-node/dist/';
import redisPubClient from 'node-common-utils/dist/redis/redis.pub.client';
import { Messages } from '../../messages';

const saveUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const fUid = JSON.parse(req.currentUser.decodedToken!!).uid;

  if (!data.uid) data.uid = fUid;
  if (data.uid !== fUid && !req.rights.isDataManager && !req.rights.isAdmin)
    throw new apiErrors.ForbiddenError(
      `Logged in User is not [currentUser | Admin | dataManager] and the uid(${data.uid}) trying to save is not the same as the logged in user(${fUid})`,
      'Access Denied! Cannot save user details!',
    );

  const user = await db.userRepository.createNewUser(data);
  if (!user)
    throw new apiErrors.ConflictError(
      `User with uid ='${data.uid}' Already Exists`,
      'User Already Exists',
      'CONFLICT_USER',
    );

  redisPubClient.publish(Messages.USER_SIGN_UP, JSON.stringify(user));
  return new apiResponses.CreatedResponse(user).send(res);
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const users = await db.userRepository.getUsers({
    uid: req.query.uid ? (req.query.uid as string) : undefined,
    id: req.query.id ? (req.query.id as string) : undefined,
    email: req.query.email ? (req.query.email as string) : undefined,
    phone_number: req.query.phone_number
      ? (req.query.phone_number as string)
      : undefined,
    username: req.query.username ? (req.query.username as string) : undefined,
    limit: limit,
    page: page,
  });
  return new apiResponses.SuccessResponse({
    page: page,
    data: users,
  }).send(res);
});

const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const user = req.requestedUser.user!!;
  return new apiResponses.SuccessResponse(user).send(res);
});

const updateUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const user = req.requestedUser.user!!;

  const updatedUser = req.body;
  if (
    (updatedUser._id && user._id != updatedUser._id) ||
    (updatedUser.uid && user.uid != updatedUser.uid)
  )
    throw new apiErrors.ForbiddenError(
      `user._id or user.uid cannot be updated!`,
      'Failed to update user details.',
    );
  const result = await db.userRepository.updateUserDetails(updatedUser, user.uid);
  return new apiResponses.SuccessResponse(result).send(res);
});

const deleteUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const user = req.requestedUser.user!!;
  const result = await db.userRepository.deleteUser(user.uid);
  redisPubClient.publish(Messages.USER_REMOVED, JSON.stringify(user));
  return new apiResponses.SuccessResponse(result).send(res);
});

export default {
  save: {
    controller: saveUserDetails,
    schema: userSchemas.saveUserDetails,
  },
  getDetails: {
    controller: getUsers,
    schema: userSchemas.getUsers,
  },
  get: {
    controller: getUserDetails,
    schema: userSchemas.getUserDetails,
  },
  getUserByEmail: {
    controller: getUsers,
    schema: userSchemas.getUserByEmail,
  },
  update: {
    controller: updateUserDetails,
    schema: userSchemas.updateUserDetails,
  },
  delete: {
    controller: deleteUserDetails,
    schema: userSchemas.deleteUserDetail,
  },
};
