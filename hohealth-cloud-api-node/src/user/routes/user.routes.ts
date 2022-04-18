import { Router } from 'express';
import auth from '../../auth';
import validators from 'node-common-utils/dist/validations/validators';
import userController from '../controllers/user.controller';
import commonSchema from '../../common/api/common.schema';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.use(validators(commonSchema.incomingRequest, true));
  //Use authentication for all requests
  route.use(auth.authentication);

  //-----------------Read Routes---------------------
  route.get(
    '/all/',
    validators(userController.getDetails.schema),
    auth.authorization.rights.admin,
    userController.getDetails.controller,
  );

  route.get(
    '/email/',
    validators(userController.getUserByEmail.schema),
    auth.authorization.rights.admin,
    userController.getUserByEmail.controller,
  );

  route.get(
    '/',
    validators(userController.get.schema),
    auth.authorization.user.currentOrAdmin,
    userController.get.controller,
  );

  //-----------------Insert Routes------------------
  route.post(
    '/',
    validators(userController.save.schema),
    auth.authorization.user.authenticated,
    userController.save.controller,
  );

  //-----------------Update Routes------------------
  route.patch(
    '/',
    validators(userController.update.schema),
    auth.authorization.user.currentOrWrite,
    userController.update.controller,
  );

  //-----------------Delete Routes-----------------
  route.delete(
    '/',
    validators(userController.delete.schema),
    auth.authorization.user.currentOrAdmin,
    userController.delete.controller,
  );
};
