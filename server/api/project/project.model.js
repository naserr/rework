'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';
import User, {UserSchema} from '../user/user.model';

var KaySchema = new mongoose.Schema({
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
  owner: UserSchema,
  created: {
    type: Date,
    default: Date.now
  },
  keys: [KaySchema],
  plan: {},
  users: [mongoose.Schema.Types.ObjectId],
  boards: [{}]
});

ProjectSchema.post('save', function(doc) {
  doc.keys.push({value: doc.generateKey(12)});
  doc.keys.push({value: doc.generateKey(12)});
  doc.keys.push({value: doc.generateKey(12)});

  User.findById(doc.owner._id).exec()
    .then(function(user) {
      user.isFresh = false;
      return user.save();
    });

  doc.save();
});

ProjectSchema.methods = {
  generateKey(len) {
    let token = crypto.randomBytes(Math.ceil(len / 2))
      .toString('hex') // convert to hexadecimal format
      .slice(0, len);   // return required number of characters

    return this._id.toString().concat(token);
  }
};

export default mongoose.model('Project', ProjectSchema);
