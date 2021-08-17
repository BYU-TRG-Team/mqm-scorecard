/* eslint-disable class-methods-use-this */
const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authConfig = require('../config/auth.config');
const roles = require('../roles');

class TokenHandler {
  generateUpdatedUserAuthToken(req, newAttributes) {
    const {
      id, role, verified, username, rememberMe,
    } = jwtDecode(req.cookies.scorecard_authtoken);

    const newToken = jwt.sign({
      id, role, verified, username, rememberMe, ...newAttributes,
    }, authConfig.secret, {
      expiresIn: 604800, //  1 week
    });

    const cookieOptions = {
      expires: rememberMe ? new Date(604800000 + Date.now()) : 0,
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    };

    return {
      newToken,
      cookieOptions,
    };
  }

  isPasswordTokenExpired(user) {
    const tokenDate = new Date(user.reset_password_token_created_at);
    const currentDate = new Date();
    return tokenDate.getTime() < (currentDate.getTime() - 1800000); // Password reset token is considered expired after 30 minutes
  }

  generateEmailVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  generatePasswordResetToken() {
    return {
      resetPasswordToken: crypto.randomBytes(20).toString('hex'),
      resetPasswordTokenCreatedAt: new Date().toISOString(),
    };
  }

  generateUserAuthToken(user, req) {
    const {
      // eslint-disable-next-line camelcase
      verified, user_id, username, role_id,
    } = user;

    const role = roles[String(role_id)];
    const token = jwt.sign({
      id: user_id, role, verified, username, rememberMe: !!req.body.rememberMe,
    }, authConfig.secret, {
      expiresIn: 604800, //  1 week
    });

    const cookieOptions = {
      expires: req.body.rememberMe ? new Date(604800000 + Date.now()) : 0,
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    };

    return {
      token,
      cookieOptions,
    };
  }
}

module.exports = TokenHandler;
