import { User } from 'hohealth-db-node/dist/user/user.model';

export class CurrentUser {
  /**
   * If authenticated; this holds the decoded token of the currently logged in user.
   */
  decodedToken?: string | null = null;
  /**
   * If authenticated; this holds the details of currently logged in user(if user exists in database)
   */
  user?: User | null = null;
}

export class Rights {
  /**
   * Tells if the current logged in user has admin rights.
   */
  isAdmin: boolean = false;
  /**
   * Tells if the currently logged in user has data viewer rights.
   */
  isDataViewer: boolean = false;
  /**
   * Tells if the currently logged in user has data manager rights.
   */
  isDataManager: boolean = false;
}

export class UserDetails {
  /**
   * Details of the requested user, if the user exists
   */
  user?: User | null = null;
}
