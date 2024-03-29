'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/projectUsers/:id', auth.isAuthenticated(), controller.projectUsers);
router.get('/findByEmail/:q', auth.isAuthenticated(), controller.findByEmail);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/settings', auth.isAuthenticated(), controller.settings);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
