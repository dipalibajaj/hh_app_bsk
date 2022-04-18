import Joi from 'joi';
import {
  isObjectId,
  ValidationSource,
} from 'node-common-utils/dist/validations/validators';

export default {
  saveUserDetails: [
    {
      source: ValidationSource.BODY,
      schema: Joi.object()
        .keys({
          _id: Joi.string().allow('', null),
          uid: Joi.string().alphanum().allow('', null),
          name: Joi.string().max(70).required(),
          email: Joi.string().lowercase().email().required(),
          phone_number: Joi.string().allow('', null),
          username: Joi.string().max(50).allow('', null),
          dob: Joi.string().allow('', null),
          gender: Joi.string().allow('', null),
          profile_image: Joi.string().allow('', null),
        })
        .unknown(false),
    },
  ],

  getUserDetails: [
    {
      source: ValidationSource.QUERY,
      schema: Joi.object()
        .keys({ uid: Joi.string().alphanum().required() })
        .unknown(false),
    },
  ],

  getUsers: [
    {
      source: ValidationSource.QUERY,
      schema: Joi.object()
        .keys({
          uid: Joi.string(),
          id: isObjectId(),
          email: Joi.string().email(),
          phone_number: Joi.string(),
          username: Joi.string(),
          page: Joi.number().greater(0),
          limit: Joi.number().greater(0),
        })
        .unknown(false),
    },
  ],

  getUserByEmail: [
    {
      source: ValidationSource.QUERY,
      schema: Joi.object()
        .keys({
          email: Joi.string().email().required(),
          page: Joi.number().greater(0),
          limit: Joi.number().greater(0),
        })
        .unknown(false),
    },
  ],

  updateUserDetails: [
    {
      source: ValidationSource.QUERY,
      schema: Joi.object()
        .keys({ uid: Joi.string().alphanum().required() })
        .unknown(false),
    },
    {
      source: ValidationSource.BODY,
      schema: Joi.object()
        .keys({
          _id: Joi.string().allow('', null),
          uid: Joi.string().alphanum().allow('', null),
          email: Joi.string().lowercase().email(),
          name: Joi.string().max(50),
          username: Joi.string().max(50).allow('', null),
          dob: Joi.string().allow('', null),
          gender: Joi.string().allow('', null),
          phone_number: Joi.string().allow('', null),
          profile_image: Joi.string().allow('', null),
        })
        .or(
          'email',
          'name',
          'phone_number',
          'profile_image',
          'username',
          'dob',
          'gender',
        )
        .unknown(false)
        .required(),
    },
  ],

  deleteUserDetail: [
    {
      source: ValidationSource.QUERY,
      schema: Joi.object()
        .keys({ uid: Joi.string().alphanum().required() })
        .unknown(false),
    },
  ],
};
