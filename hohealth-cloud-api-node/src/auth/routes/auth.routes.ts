import { Router } from 'express';
import authController from '../controllers/auth.controller';
import validators from 'node-common-utils/dist/validations/validators';

export default (app: Router) => {
  //An endpoint to get the access-token; Not being used by the app!
  app.post(
    '/signIn',
    validators(authController.signIn.schema),
    authController.signIn.controller,
  );
};
