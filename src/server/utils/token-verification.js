var jwt = require('jwt-simple');
// Middleware authentication
exports.isVerified = function(req, res, next) {
  // Get token from header
  var token = req.headers.token;
  // Check token
  if (!token) {
    return res.status(401).send({
      message: 'Not found'
    });
  }
  // Decode token
  var payload = null;
  try {
    payload = jwt.decode(token, 'chat_app');
  } catch (err) {
    return res.status(401).send({
      message: err.message
    });
  }
  if (payload.expire <= Date.now()) {
    return res.status(401).send({
      message: 'Token has expired'
    });
  }
  req.user = payload.sub;
  next();
};
