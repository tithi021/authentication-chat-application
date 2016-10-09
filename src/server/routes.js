var router = require('express')
  .Router();
var four0four = require('./utils/404')();
var User = require('./user.model');
var jwt = require('jwt-simple');
var moment = require('moment');
//var data = require('./data');
// router.get('/people', getPeople);
// router.get('/person/:id', getPerson);
// router.get('/*', four0four.notFoundMiddleware);
// User registration
router.post('/registration', registration);
router.post('/login', login);
router.get('/*', four0four.notFoundMiddleware);
// module.exports = router;
function registration(req, res, next) {
  console.log(req.body);
  var query = {
    'email': req.body.email,
    'username': req.body.username
  };
  // Query in user schema
  // By email/username
  User.findOne(query, callback);
  // First Callback function
  function callback(error, found) {
    console.log('found');
    console.log(found);
    if (error) {
      res.status(400)
        .send({
          message: 'The email or username is already exists.'
        });
    }
    else {
      console.log('else');
      // Get user data
      var newUser = new User({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      console.log(newUser);
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
// //////////////
// function getPeople(req, res, next) {
//   res.status(200).send(data.people);
// }
// function getPerson(req, res, next) {
//   var id = +req.params.id;
//   var person = data.people.filter(function(p) {
//     return p.id === id;
//   })[0];
//   if (person) {
//     res.status(200).send(person);
//   } else {
//     four0four.send404(req, res, 'person ' + id + ' not found');
//   }
// }
module.exports = router;
