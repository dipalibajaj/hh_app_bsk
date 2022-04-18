import Joi from 'joi';
import { ValidationSource } from 'node-common-utils/dist/validations/validators';

export default {
  signIn: [
    {
      source: ValidationSource.BODY,
      schema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }).unknown(false),
    },
  ],
};
