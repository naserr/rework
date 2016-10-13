/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/contacts', require('./api/contact'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  app.route('/landing')
    .get((req, res) => {
      console.log('>>>>>>>> /landing');
      res.sendFile(path.resolve(`${app.get('appPath')}/landing.html`));
    });

  app.route('/')
    .get((req, res) => {
      console.log('>>>>>>>> /');
      res.redirect('/landing');
    });

  app.route('/main')
    .get((req, res) => {
      console.log('>>>>>>>> /main');
      res.sendFile(path.resolve(`${app.get('appPath')}/main.html`));
    });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      console.log('>>>>>>>> /*');
      res.sendFile(path.resolve(`${app.get('appPath')}/main.html`));
    });
}
