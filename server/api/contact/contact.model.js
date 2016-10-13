'use strict';

import mongoose from 'mongoose';

var ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  text: String,
  read: Boolean
});

export default mongoose.model('Contact', ContactSchema);
