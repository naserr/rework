'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../user/user.model';

var KaySchema = new mongoose.Schema({
  // value = projectId + role + 12 random chars
  value: String,
  active: {
    type: Boolean,
    default: true
  }
});

var ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {},
  created: {
    type: Date,
    default: Date.now
  },
  keys: [KaySchema],
  users: [{
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    role: {
      type: Number,
      enum: [0, 1, 2]
    },
    date: {
      type: Date,
      default: new Date()
    }
  }],
  defaultBoard: {},
  boards: [{
    name: String,
    added: {
      type: Date,
      default: new Date()
    },
    users: [{
      _id: String,
      name: String,
      email: String,
      role: {
        type: Number,
        enum: [0, 1, 2]
      }
    }]
  }],
  cards: [{
    _id: String,
    user: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      email: String,
      date: {
        type: Date,
        default: new Date()
      }
    },
    board: String,
    position: {
      top: String,
      left: String
    },
    scale: {
      type: String,
      default: '1',
      enum: ['1', '0.75', '0.5', '0.25']
    },
    cardType: String,
    content: String,
    added: {
      type: Date,
      default: new Date()
    }
  }],
  tasks: [{}]
});

// ProjectSchema.post('save', function(doc) {
//   User.findById(doc.owner._id).exec()
//     .then(user => {
//       user.isFresh = false;
//       return user.save();
//     });
// });

ProjectSchema.post('remove', function(doc) {
  User.update({defaultProject: doc._id}, {defaultProject: null}, {multi: true}).exec();
});

ProjectSchema.methods = {
  generateKey(role, len = 12) {
    let token = crypto.randomBytes(Math.ceil(len / 2))
      .toString('hex') // convert to hexadecimal format
      .slice(0, len);   // return required number of characters

    return {
      value: this._id.toString()
        .concat(role)
        .concat(token)
    };
  },

  deactivateKey(key) {
    let theKey = this.keys.find(k => k.value === key);
    if(!theKey || !theKey.active) {
      return false;
    }

    theKey.active = false;
    return true;
  }
};

export default mongoose.model('Project', ProjectSchema);
