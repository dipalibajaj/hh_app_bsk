import { Request } from 'express';
import { CurrentUser, Rights, UserDetails } from '../common/api.requests';

declare global {
  namespace Express {
    export interface Request {
      /**
       * Contains the details of the currently logged in user.
       */
      currentUser: CurrentUser;
      /**
       * Contains the rights of the currently logged in user.
       */
      rights: Rights;
      /**
       * Contains the details of the user requested.
       */
      requestedUser: UserDetails;
    }
  }
}
