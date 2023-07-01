const bcrypt = require('bcrypt');
const smtpConfig = require('../config/smtp.config');
const errorMessages = require('../messages/errors.messages');

class AuthController {
  constructor(smtpService, userService, tokenService, tokenHandler, db, logger) {
    this.smtpService = smtpService;
    this.userService = userService;
    this.tokenService = tokenService;
    this.tokenHandler = tokenHandler;
    this.db = db;
    this.logger = logger;
  }

  /*
  * POST /api/auth/signup
  * @username
  * @email
  * @password
  * @name
  */
  async signup(req, res) {
    let transactionInProgress = false;
    const client = await this.db.connect();

    try {
      const {
        username, email, password, name,
      } = req.body;

      if (username === undefined || email === undefined || password === undefined || name === undefined) {
        res.status(400).send({ message: 'Body must include username, email, password, and name' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await client.query('BEGIN');
      transactionInProgress = true;

      const userResponse = await this.userService.create(username, email, hashedPassword, 1, name, client);
      const newUser = userResponse.rows[0];

      const emailVerificationToken = this.tokenHandler.generateEmailVerificationToken();
      await this.tokenService.create(newUser.user_id, emailVerificationToken, client);

      await this.sendVerificationEmail(req, newUser, emailVerificationToken);

      await client.query('COMMIT');
      transactionInProgress = false;

      res.status(204).send();
      return;
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    } finally {
      if (transactionInProgress) {
        await client.query('ROLLBACK');
      }
      client.release();
    }
  }

  /*
  * POST /api/auth/signin
  * @username
  * @password
  */
  async signin(req, res) {
    try {
      const { username, password } = req.body;

      if (username === undefined || password === undefined) {
        res.status(400).send({ message: 'Body must include a username and password' });
        return;
      }

      const userResponse = await this.userService.findUsers(['username'], [username]);

      if (userResponse.rows.length === 0) {
        res.status(400).send({ message: errorMessages.loginError });
        return;
      }

      const user = userResponse.rows[0];

      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password,
      );

      if (!passwordIsValid) {
        res.status(400).send({
          message: errorMessages.loginError,
        });
        return;
      }

      const { token, cookieOptions } = await this.tokenHandler.generateUserAuthToken(user, req);
      res.cookie('scorecard_authtoken', token, cookieOptions);
      res.json({ token });
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * GET /api/auth/logout
  */

  // eslint-disable-next-line class-methods-use-this
  logout(_req, res) {
    try {
      res.clearCookie('scorecard_authtoken', { path: '/' }).send();
      return;
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * GET api/auth/verify/:token
  */
  async verify(req, res) {
    try {
      // Find a matching token
      const verifyTokenResponse = await this.tokenService.findTokens(['token'], [req.params.token]);

      if (verifyTokenResponse.rows.length === 0) {
        res.redirect('/login');
        return;
      }

      const verifyToken = verifyTokenResponse.rows[0];

      // Find associated user
      const userResponse = await this.userService.findUsers(['user_id'], [verifyToken.user_id]);

      if (userResponse.rows.length === 0) {
        res.status(500).send({ message: errorMessages.generic });
        return;
      }
      const user = userResponse.rows[0];

      // Set user as verified
      await this.userService.setAttributes(['verified'], [true], user.user_id);
      await this.tokenService.deleteToken(verifyToken.token);

      res.redirect('/login');
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * POST api/auth/recovery
  * @email
  */
  async recovery(req, res) {
    try {
      const { email } = req.body;

      if (email === undefined) {
        res.status(400).send({ message: 'Body must include email' });
        return;
      }

      const userResponse = await this.userService.findUsers(['email'], [email]);

      if (userResponse.rows.length === 0) {
        res.redirect('/recover/sent');
        return;
      }

      const user = userResponse.rows[0];
      await this.sendPasswordResetEmail(req, user);
      res.redirect('/recover/sent');
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * GET api/auth/recovery/verify/:token
  */
  async verifyRecovery(req, res) {
    try {
      const userResponse = await this.userService.findUsers(['reset_password_token'], [req.params.token]);

      if (userResponse.rows.length === 0) {
        res.status(400).send({ message: errorMessages.generic });
        return;
      }

      const user = userResponse.rows[0];

      if (this.tokenHandler.isPasswordTokenExpired(user)) {
        res.status(400).send({ message: errorMessages.generic });
        return;
      }

      res.redirect(`/recover/${req.params.token}`);
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /* POST api/auth/recovery/:token
  * @password
  */
  async processRecovery(req, res) {
    const { password } = req.body;

    if (password === undefined) {
      res.status(400).json({ message: 'Body must include password' });
      return;
    }

    try {
      const userResponse = await this.userService.findUsers(['reset_password_token'], [req.params.token]);
      if (userResponse.rows.length === 0) {
        res.status(400).send({ message: errorMessages.generic });
        return;
      }

      const user = userResponse.rows[0];
      if (this.tokenHandler.isPasswordTokenExpired(user)) {
        res.status(400).send({ message: errorMessages.generic });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userService.setAttributes(['password', 'reset_password_token'], [hashedPassword, ''], user.user_id);
      const { token, cookieOptions } = this.tokenHandler.generateUserAuthToken(user, req);
      res.cookie('scorecard_authtoken', token, cookieOptions);
      res.send({ token });
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  sendVerificationEmail(req, user, token) {
    const link = `http://${req.headers.host}/api/auth/verify/${token}`;
    const emailOptions = {
      subject: 'Account Verification Request',
      to: user.email,
      from: smtpConfig.email,
      html: `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                            <br><p>If you did not request this, please ignore this email.</p>`,
    };

    return this.smtpService.sendEmail(emailOptions);
  }

  sendPasswordResetEmail(req, user) {
    return new Promise((resolve, reject) => {
      try {
        const { resetPasswordToken, resetPasswordTokenCreatedAt } = this.tokenHandler.generatePasswordResetToken();
        return this.userService.setAttributes(['reset_password_token', 'reset_password_token_created_at'], [resetPasswordToken, resetPasswordTokenCreatedAt], user.user_id)
          .then(() => {
            const link = `http://${req.headers.host}/api/auth/recovery/verify/${resetPasswordToken}`;
            const emailOptions = {
              subject: 'Password Recovery Request',
              to: user.email,
              from: smtpConfig.email,
              html: `<p>Hi ${user.username}</p>
                                    <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
                                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
            };

            return this.smtpService.sendEmail(emailOptions).then(resolve);
          })
          .catch((err) => reject(err));
      } catch (err) {
        return reject(err);
      }
    });
  }
}

module.exports = AuthController;
