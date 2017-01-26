/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import ProjectEvents from './project.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(socket, io) {
  socket.on('NEW_PROJECT', function(data) {
    socket.join(data.projectId);
  });

  socket.on('NEW_MSG', function(data) {
    // io.in(data.projectId).emit('MSG_CREATED', data);
    data.class = 'left';
    socket.broadcast.to(data.projectId).emit('MSG_CREATED', data);
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
    console.log('socketio > ', event, doc._id);
    io.in(doc._id).emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    ProjectEvents.removeListener(event, listener);
  };
}
