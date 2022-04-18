import axios from 'axios';
import { Request, Response } from 'express';
import config from '../../common/config';
import asyncHandler from 'node-common-utils/dist/api/async.handler';
import apiErrors from 'node-common-utils/dist/api/api.errors';
import apiResponses from 'node-common-utils/dist/api/api.responses';
import authSchemas from './auth.controller.schemas';

const issueToken = asyncHandler(async (req: Request, res: Response) => {
  const email = req.body.email!!;
  const password = req.body.password!!;
  const requestBody = {
    email: email,
    password: password,
    returnSecureToken: true,
  };
  try {
    const result = await axios.post(
      `https://identitytoolkit.googleapis.com//v1/accounts:signInWithPassword?key=${config.firebase.webApiKey}`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return new apiResponses.SuccessResponse(result.data).send(res);
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new apiErrors.AuthFailureError(
        `Failed to fetch token; Status = ${error.response.data.error.code}; error = ${error.response.data.error.message}`,
        'Failed to fetch token!',
      );
    } else if (error.request) {
      // The request was made but no response was received
      logger.debug(error.request);
      throw new apiErrors.InternalError(
        `Failed to fetch token; Error =${error.message}`,
        'Failed to fetch token!',
      );
    } else {
      logger.debug(error.request);
      throw new apiErrors.InternalError(
        `Failed to fetch token; Error =${error.message}`,
        'Failed to fetch token!',
      );
    }
  }
});

export default {
  signIn: {
    controller: issueToken,
    schema: authSchemas.signIn,
  },
};
