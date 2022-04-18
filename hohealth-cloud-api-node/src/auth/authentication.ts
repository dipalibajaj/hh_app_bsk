import express from 'express';
import admin from 'firebase-admin';
import apiErrors from 'node-common-utils/dist/api/api.errors';
import asyncHandler from 'node-common-utils/dist/api/async.handler';
import config from '../common/config';
import { CurrentUser, Rights, UserDetails } from '../common/api/api.requests';
import validators from 'node-common-utils/dist/validations/validators';
import commonSchema from '../common/api//common.schema';
import db from 'hohealth-db-node/dist/';

const router = express.Router();

export default router.use(
  validators(commonSchema.auth),
  asyncHandler(
    async (
      req: express.Request,
      _res: express.Response,
      next: express.NextFunction,
    ) => {
      try {
        const accessToken: string = req.header('authorization')!!;
        let token: string;
        if (accessToken.startsWith('Bearer'))
          token = accessToken.substring('Bearer '.length);
        else token = accessToken;
        const decodedToken = await admin.auth().verifyIdToken(token);

        req.currentUser = new CurrentUser();
        req.rights = new Rights();
        req.requestedUser = new UserDetails();
        req.currentUser.decodedToken = JSON.stringify(decodedToken).toString();
        try {
          req.currentUser.user = await db.userRepository.getUserById(
            decodedToken.uid,
          );
        } catch (e: any) {
          throw new apiErrors.InternalError(e.message);
        }

        //Is user having admin claim
        req.rights.isAdmin = decodedToken.admin === true;
        //Is user having dataManager claim
        req.rights.isDataManager = decodedToken.dataManager === true;
        //Is user having dataViewer claim
        req.rights.isDataViewer = decodedToken.dataViewer === true;

        if (config.isTesting) {
          req.rights.isAdmin = config.testing.isAdmin;
          req.rights.isDataManager = config.testing.isDataManager;
          req.rights.isDataViewer = config.testing.isDataViewer;
        }

        return next();
      } catch (error: any) {
        if (error instanceof apiErrors.ApiError) throw error;
        else throw new apiErrors.BadTokenError(error.message);
      }
    },
  ),
);
