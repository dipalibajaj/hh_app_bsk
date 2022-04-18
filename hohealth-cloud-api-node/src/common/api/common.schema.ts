import Joi from 'joi';
import {
  isJwtBearerToken,
  ValidationSource,
} from 'node-common-utils/dist/validations/validators';

export default {
  incomingRequest: [
    {
      source: ValidationSource.HEADER,
      schema: Joi.object()
        .keys({
          authorization: isJwtBearerToken().required(),
          'content-type': Joi.string().valid('application/json'),
        })
        .unknown(true),
    },
  ],
  auth: [
    {
      source: ValidationSource.HEADER,
      schema: Joi.object()
        .keys({
          authorization: isJwtBearerToken().required(),
        })
        .unknown(true),
    },
  ],
};
