'use strict';

var express = require('express');
var controller = require('./project.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/join', auth.isAuthenticated(), controller.join);
router.post('/selectBoard', auth.isAuthenticated(), controller.selectBoard);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.put('/updateCards/:id', auth.isAuthenticated(), controller.updateCards);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
