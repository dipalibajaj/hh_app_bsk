import config from '../common/config';
import admin from 'firebase-admin';
import authentication from './authentication';
import authorization from './authorization';

export default {
  init: () =>
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(
          Buffer.from(config.firebase.adminCertificate, 'base64').toString(
            'ascii',
          ),
        ),
      ),
      databaseURL: config.firebase.databaseUrl,
    }),

  authentication,

  authorization,
};
