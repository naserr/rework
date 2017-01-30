'use strict';

// import _ from 'lodash';
import Message from './message.model';
import Project from './project.model';
import _ from 'lodash';

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

export function history(req, res) {
  return Project.findById(req.params.id).exec()
    .then(project => {
      if(!project) {
        return res.status(404).end();
      }
      let user = project.users.id(req.user._id);
      let board = _.find(project.boards, {name: req.params.board});
      let isBoardMember = false;
      if(board) {
        isBoardMember = _.findIndex(board.users, {_id: req.user._id}) > -1;
        if(!isBoardMember) {
          isBoardMember = project.owner._id.toString() === req.user._id.toString();
        }
      }
      console.log('\n403> ',!!user, !!board, isBoardMember, typeof project.owner._id, typeof req.user._id, '\n');
      if(!user || !board || !isBoardMember) {
        return res.status(403).send('دسترسی غیر مجاز');
      }
      return recentMessages(`${req.params.id}${req.params.board}`, 20)
        .then(messages => res.status(200).json(messages))
    })
    .catch(err => {
      console.log('err >>> ', err);
      return res.status(500).end()
    });
}
