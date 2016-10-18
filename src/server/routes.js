var router = require('express')
  .Router();
var four0four = require('./utils/404')();
var User = require('./models/user.model');
var Chat = require('./models/chat.model');
var jwt = require('jwt-simple');
var moment = require('moment');
var _ = require('lodash');
var token = require('./utils/token-verification');
var socket = require('socket.io');
var io = socket();
// User registration
router.post('/registration', registration); // user registration
router.post('/login', login); // user login
router.get('/userVerify', token.isVerified, userVerify); // user profile verify
router.get('/userList', token.isVerified, userList); // load all user list
router.post('/sendChatMessage', token.isVerified, sendChatMessage); // user chat
router.get('/loadChatMessages/:chatUserId', token.isVerified, loadChatMessages); // load chat messages

function registration(req, res, next) {
  var query = {
    'email': req.body.email,
    'username': req.body.username
  };
  // Query in user schema
  // By email/username
  User.findOne(query, callback);
  // First Callback function
  function callback(error, found) {
    if (error) {
      res.status(400)
        .send({
          message: 'The email or username is already exists.'
        });
    }
    else {
      // Get user data
      var newUser = new User({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      // Attempt to save the user
      newUser.save(function(err, user, num) {
        console.log(err);
        if (err) {
          four0four.send404(req, res, 'Registration not success!');
        }
        else {
          var expire = moment()
            .add(7, 'days')
            .valueOf(); // Get current date and time
          var payload = {
            sub: user._id,
            expire: expire
          };
          var token = jwt.encode(payload, 'chat_app'); // Encode token with payload and secret key
          // Send Response
          res.status(200)
            .send({
              user: user.toJSON(),
              token: token,
              expire: expire
            });
        }
      });
    }
  }
}

function login(req, res) {
  // Query by email/username to find User
  User.findOne({
    $or: [{
      email: req.body.username
    }, {
      username: req.body.username
    }]
  }, callback1);
  // Execute callback1 function
  function callback1(err, user) {
    if (err) {
      res.send(err); // Through a error
    }
    else {
      // If not found any user
      if (!user) {
        return res.status(401)
          .send({
            message: 'NotFound'
          });
      }
      // If found
      // Compare Password
      user.comparePassword(req.body.password, function callback2(error,
        match) {
        if (error) {
          res.send(error); // Through error
        }
        else {
          // If not match with user input password
          // Send to user a return message
          if (!match) {
            return res.status(401)
              .send({
                message: 'InvalidPassword'
              });
          }
          else {
            var expire = moment()
              .add(7, 'days')
              .valueOf(); // Get current date and time
            var payload = {
              sub: user._id,
              expire: expire
            };
            var token = jwt.encode(payload, 'chat_app'); // Encode token with payload and secret key
            // Send Response
            res.status(200)
              .send({
                user: user.toJSON(),
                token: token,
                expire: expire
              });
          }
        }
      });
    }
  }
}

function userVerify(req, res) {
  if (req.user) {
    User.findOne({
      '_id': req.user
    }, function(error, user) {
      if (error) {
        res.status(401)
          .send(error);
      }
      else {
        if (user) {
          res.status(200)
            .send(user);
        }
      }
    });
  }
}
function userList(req, res) {
  if (req.user) {
    User.find({ '_id': { $ne: req.user } },function(error, user) {
      if (error) {
        res.status(401)
          .send(error);
      }
      else {
        res.status(200)
          .send(user);
      }
    });
  }
}

function sendChatMessage(req, res) {
  if (req.user) {
    var newChat = new Chat({
      to: req.body.chatUser,
      from: req.user,
      messages: req.body.messages
    });
    // Attempt to save the user
    newChat.save(function(err, chat, num) {
      if (err) {
        four0four.send404(req, res, 'not success!');
      }
      else {
        var data = {
          to: chat.to,
          from: chat.from,
          messages: chat.messages,
          createdDate: chat.createdDate
        };
        
        io.emit('message-from-server', {
            message: data
          });
        return res.status(200)
          .send(data);
      }
    });
  }
}
function loadChatMessages(req, res) {
  if(req.user) {
    var chat = Chat.find({
        $or: [
          { 'from': req.user }, { 'to': req.user }, {'to': req.params.chatUserId}, {'from': req.params.chatUserId}
        ]
    });
    
    chat.populate('to', 'fullname');
    chat.populate('from', 'fullname');

    chat.exec(function(err, chatInfo) {
      if(err) {
        four0four.send404(req, res, err);
      } else {
        
        res.status(200).send(chatInfo);
      }
    });
  }
}
router.get('/*', four0four.notFoundMiddleware);
module.exports = router;
