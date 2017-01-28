/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import ProjectEvents from './project.events';
import * as msgController from './message.controller';
// import _ from 'lodash';
// import constants from '../../config/environment/shared';

// Model events to emit
var events = ['save', 'remove'];

export function register(socket, io) {
  socket.on('LOGIN', projectId => socket.join(projectId));

  socket.on('JOIN', function(data) {
    socket.user = data.user;
    // io.in(data.roomId).emit('NEW_USER', data);
    socket.join(data.roomId);
    socket.broadcast.to(data.roomId).emit('NEW_USER', {
      user: data,
      users: getUsersInRoom(io, data.roomId)
    });
    msgController.recentMessages(data.roomId, 20)
      .then(messages => socket.emit('INIT', {
        messages,
        users: getUsersInRoom(io, data.roomId)
      }))
      .catch(err => console.log('errrr > ', err));
  });

  socket.on('LEAVE', function(data) {
    socket.leave(data.roomId);
    socket.broadcast.to(data.roomId).emit('LEAVE', {
      user: data,
      users: getUsersInRoom(io, data.roomId)
    });
  });

  socket.on('NEW_MSG', function(data) {
    msgController.save(data)
      .then(msg => io.in(data.roomId).emit('MSG_CREATED', msg))
      .catch(err => console.log('err > ', err));
  });

  // Bind model events to socket events
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`project:${event}`, socket, io);

    ProjectEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}

function createListener(event, socket, io) {
  return function(doc) {
    // _.each(constants.boards, b => io.in(`${doc._id}${b.name}`).emit(event, doc));
    io.in(doc._id).emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    ProjectEvents.removeListener(event, listener);
  };
}

function getUsersInRoom(io, roomId) {
  let room = io.sockets.adapter.rooms[roomId];
  if(!room) {
    return [];
  }
  let clients = room.sockets;
  let users = [];
  for(var clientId in clients) {
    if(clients.hasOwnProperty(clientId)) {
      users.push(io.sockets.connected[clientId].user);
    }
  }
  return users;
}
