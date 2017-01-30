'use strict';

var express = require('express');
var controller = require('./project.controller');
var msgController = require('./message.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/updateDefaultProject', auth.isAuthenticated(), controller.updateDefaultProject);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/join', auth.isAuthenticated(), controller.join);
router.post('/selectBoard', auth.isAuthenticated(), controller.selectBoard);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.put('/updateCards/:id', auth.isAuthenticated(), controller.updateCards);
router.put('/newUser/:id', auth.isAuthenticated(), controller.newUser);
router.put('/newBoardUser/:id', auth.isAuthenticated(), controller.newBoardUser);
router.patch('/patchTasks/:id', auth.isAuthenticated(), controller.patchTasks);
router.put('/toggleTaskVisited/:id', auth.isAuthenticated(), controller.toggleTaskVisited);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/chatHistory/:id/:board', auth.isAuthenticated(), msgController.history);

module.exports = router;
