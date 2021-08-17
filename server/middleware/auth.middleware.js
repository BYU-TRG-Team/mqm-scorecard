const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const config = require('../config/auth.config');
const errorMessages = require('../messages/errors.messages');

const verifyToken = (req, res, next) => {
  const token = req.cookies.scorecard_authtoken;

  if (!token) {
    res.status(401).send({
      message: errorMessages.requestUnauthorized,
    });
    return;
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(403).send({
        message: errorMessages.accessForbidden,
      });
      return;
    }
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};

const checkVerification = (req, res, next) => {
  const token = jwtDecode(req.cookies.scorecard_authtoken);

  if (token && token.verified) {
    next();
    return;
  }

  res.status(403).send({
    message: errorMessages.accessForbidden,
  });
};

const checkRole = (roles) => (req, res, next) => {
  const token = jwtDecode(req.cookies.scorecard_authtoken);

  if (token && roles.includes(token.role)) {
    next();
    return;
  }

  res.status(403).send({
    message: errorMessages.accessForbidden,
  });
};

module.exports = {
  verifyToken,
  checkVerification,
  checkRole,
};
