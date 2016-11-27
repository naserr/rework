/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projects              ->  index
 * POST    /api/projects              ->  create
 * GET     /api/projects/:id          ->  show
 * PUT     /api/projects/:id          ->  upsert
 * PATCH   /api/projects/:id          ->  patch
 * DELETE  /api/projects/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import _ from 'lodash';
import Project from './project.model';
import User from '../user/user.model';
import * as constants from '../../config/environment/shared';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

// Gets a list of Projects
export function index(req, res) {
  return Project.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Project from the DB
export function show(req, res) {
  return Project.findById(req.params.id, '-keys').exec()
    .then(handleEntityNotFound(res))
    .then(hasGetAuthorization(res, req.user._id))
    .then(hasExpired(res))
    .then(setDefaultProject(req.user))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of user Projects
export function me(req, res) {
  return Project.find({'users._id': req.user._id}, '-keys').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Project in the DB
export function create(req, res) {
  let newProject = new Project({
    name: req.body.name,
    owner: _.pick(req.user, ['_id', 'email', 'name', 'type', 'expire']),
    users: [{
      _id: req.user._id,
      role: constants.roleNames.admin
    }]
  });

  if(req.user.type === constants.plans.free.name && !req.user.isFresh) {
    return res.status(403).send('مجاز به ایجاد بیش از یک پروژه با پلن رایگن نیستید');
  }

  if(req.user.type === constants.plans.free.name && req.user.isFresh) {
    return newProject.save()
      .then(initFreeProject)
      .then(setDefaultProject(req.user))
      .then(respondWithResult(res, 201))
      .catch(handleError(res));
  }
}

// join a Project with a key
export function join(req, res) {
  /**
   * find project with provided key and deactivated it
   * if requested user isn't already a project member then
   * add user to project members with provided role
   **/

  if(!req.body.key || req.body.key.length !== 37) {
    return res.status(400).send('کلید وارد شده نامعتبر است! کلید معتبر تهیه کنید.');
  }

  return Project.findOne({
    'keys.value': req.body.key
  }).exec()
    .then(joinProject(req.body.key, req.user._id))
    .then(setDefaultProject(req.user))
    .then(respondWithResult(res))
    .catch(handleError(res, 400));
}

// add a board to a Project
export function selectBoard(req, res) {
  return Project.findById(req.body.id).exec()
    .then(handleEntityNotFound(res))
    .then(hasGetAuthorization(res, req.user._id))
    .then(setDefaultBoard(req.body.board))
    .then(addBoard(req.body.board))
    .then(respondWithResult(res))
    .catch(handleError(res, 400));
}

// Upserts the given Project in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Project.findOneAndUpdate({_id: req.params.id}, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Project in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Project.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Project from the DB
export function destroy(req, res) {
  return Project.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(hasDestroyAuthorization(res, req.user))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function hasGetAuthorization(res, userId) {
  return function(project) {
    if(project) {
      let user = project.users.id(userId);

      if(!user) {
        res.status(403).end('شما عضو این پروژه نیستید');
        return null;
      }
      return project;
    }
    return project;
  };
}

function hasExpired(res) {
  return function(project) {
    if(project) {
      if(project.owner.type !== constants.plans.free.name && project.owner.expire.getTime() >= Date.now()) {
        res.status(403).end('این پروژه منقضی شده است');
        return null;
      }
    }
    return project;
  };
}

function hasDestroyAuthorization(res, user) {
  return function(project) {
    if(project && !user._id.equals(project.owner._id)) {
      res.status(403).end('فقط مالک پروژه میتواند آنرا حذف کند');
      return null;
    }
    return project;
  };
}

function initFreeProject(newProject) {
  newProject.keys.push(newProject.generateKey(constants.roleNames.user));
  newProject.keys.push(newProject.generateKey(constants.roleNames.user));
  newProject.keys.push(newProject.generateKey(constants.roleNames.guest));

  return newProject.save();
}

function joinProject(key, userId) {
  let projectId = key.slice(0, 24);
  let role = key.slice(24, 25);
  let token = key.slice(25, 37);

  return function(project) {
    let isValid = project.deactivateKey(key);
    if(!isValid) {
      return Promise.reject('کلید وارد شده نامعتبر است! کلید معتبر تهیه کنید.');
    }

    // project.users.find(u => u._id === userId);
    let user = project.users.id(userId);
    if(user) {
      return Promise.reject('قبلا عضو شه اید.');
    }

    project.users.push({
      _id: userId,
      role
    });
    return project.save();
  };
}

function setDefaultProject(user) {
  return function(project) {
    if(project) {
      return User.update({_id: user._id}, {
        defaultProject: project._id,
        isFresh: false
      }).exec()
        .then(() => project);
    }
    return project;
  };
}

function setDefaultBoard(board) {
  return function(project) {
    if(project) {
      project.defaultBoard = board;
      return project.save();
    }
    return project;
  };
}

function addBoard(board) {
  return function(project) {
    if(project) {
      let theBoard = project.boards.find(b => b.name === board);
      if(theBoard) {
        project.boards.push({
          name: board,
          added: new Date()
        });
        return project.save();
      }
    }
    return project;
  };
}
