'use strict';

import mongoose from 'mongoose';

var SubscriptionSchema = new mongoose.Schema({
  email: String,
  active: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: new Date()
  }
});

export default mongoose.model('Subscription', SubscriptionSchema);
