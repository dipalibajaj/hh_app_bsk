import claimsAuthorization from './claims.authorization';
import userAuthorization from '../user/auth/user.authorization';

export default {
  rights: {
    admin: claimsAuthorization.isUserAdmin,
    read: claimsAuthorization.isUserDataViewer,
    write: claimsAuthorization.isUserDataManager,
  },
  user: {
    authenticated: userAuthorization.signedIn,
    currentUserExists: userAuthorization.currentUserExists,
    exists: userAuthorization.requestedUserExists,
    current: userAuthorization.isCurrentUser,
    currentOrRead: userAuthorization.isCurrentUserOrCanReadData,
    currentOrWrite: userAuthorization.isCurrentUserOrCanWriteData,
    currentOrAdmin: userAuthorization.isCurrentUserOrAdmin,
  },
};
