'use strict';

import mongoose from 'mongoose';

var SubscriptionSchema = new mongoose.Schema({
  email: String,
  active: Boolean
});

export default mongoose.model('Subscription', SubscriptionSchema);
