import { Router } from 'express';
import health from './health.routes';
import root from './root.routes';
import methodOverride from 'method-override';
import config from '../config';
import auth from '../../auth/routes/auth.routes';
import user from '../../user/routes/user.routes';

export default () => {
  const app = Router();
  app.use(methodOverride('X-HTTP-Method-Override'));
  //load the routes supported
  auth(app);
  health(app);
  if (!config.isProd) root(app);
  user(app);
  return app;
};
