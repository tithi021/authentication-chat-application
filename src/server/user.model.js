/**
 * Copyright (c) 2016, @Company Name. All rights reserved.
 */
/**
 * UserModule
 *
 * @author      Afroza Yasmin
 * @version     1.0
 * @description :: This module exposes user schema
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  fullname: String,
  email: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: Date,
  tokenKey: String, // Randomly generated token key for api access
  salt: String, // unique salt for reset password
});
/*
 |--------------------------------------------------------------------------
 | Hide password
 |--------------------------------------------------------------------------
*/
UserSchema.methods.toJSON = function() {
  var user = this.toObject();
  delete user.password;
  return user;
};
/*
 |--------------------------------------------------------------------------
 | Password hash create
 |--------------------------------------------------------------------------
*/
UserSchema.pre('save', function(next) {
  var self = this;
  if (!self.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(self.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      self.password = hash;
      next();
    });
  });
});
/*
 |--------------------------------------------------------------------------
 | Compare Password
 |--------------------------------------------------------------------------
*/
UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
};
var Model = mongoose.model('User', UserSchema);
module.exports = Model;
