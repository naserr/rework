'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../user/user.model';

var MessageSchema = new mongoose.Schema({
  roomId: String,
  user: {},
  content: String,
  created: {
    type: Date,
    default: new Date()
  }
});

export default mongoose.model('Message', MessageSchema);
