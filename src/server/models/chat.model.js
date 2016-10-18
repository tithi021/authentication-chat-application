var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChatSchema = new Schema({
  // Chat user
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Login user Id
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: String,
  status: { type: Boolean, default: false },
  createdDate: {
    type: Date,
    default: Date.now
  }
});
var Model = mongoose.model('Chat', ChatSchema);
module.exports = Model;
