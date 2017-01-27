'use strict';

// import _ from 'lodash';
import Message from './message.model';

export function save(msg) {
  let newMsg = new Message(msg);
  return newMsg.save();
}

export function recentMessages(roomId, count) {
  return Message.find({roomId})
    .sort({_id: -1})
    .limit(count)
    .exec();
}
