const bcrypt = require('bcrypt');
const errorMessages = require('../messages/errors.messages');
const roles = require('../roles');

class UserController {
  constructor(userService, tokenHandler, logger) {
    this.userService = userService;
    this.tokenHandler = tokenHandler;
    this.logger = logger;
  }

  /*
  * PATCH /api/user/:id
  * @username (optional)
  * @email (optional)
  * @name (optional)
  * @password (optional)
  * roleId (optional)
  */
  async updateUser(req, res) {
    try {
      const isClientUser = Number(req.userId) === Number(req.params.id);
      const newAttributes = {};
      const superadminNewAttributes = {};

      Object.keys(req.body).forEach((attr) => {
        if (['username', 'email', 'name', 'password'].includes(attr)) {
          newAttributes[attr] = req.body[attr];
        }

        if (['roleId'].includes(attr)) {
          superadminNewAttributes[attr] = req.body[attr];
        }
      });

      if (newAttributes.password !== undefined) {
        newAttributes.password = await bcrypt.hash(newAttributes.password, 10);
      }

      if (
        isClientUser
        && Object.keys(newAttributes).length > 0
      ) {
        const attributes = [];
        const values = [];
        Object.keys(newAttributes).forEach((attr) => { attributes.push(attr); values.push(newAttributes[attr]); });
        await this.userService.setAttributes(attributes, values, req.userId);
      }

      // Update these attributes regardless of whether the param id is equal to the client's id
      if (
        req.role === 'superadmin'
        && Object.keys(superadminNewAttributes).length > 0
      ) {
        const attributes = ['role_id'];
        const values = [superadminNewAttributes.roleId];
        await this.userService.setAttributes(attributes, values, req.params.id);
      }

      if (newAttributes.username) {
        const { newToken, cookieOptions } = await this.tokenHandler.generateUpdatedUserAuthToken(req, newAttributes);
        res.cookie('scorecard_authtoken', newToken, cookieOptions);
        res.send({ newToken });
        return;
      }

      res.status(204).send();
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * GET /api/user/:id
  */
  async getUser(req, res) {
    try {
      if (Number(req.params.id) !== req.userId) {
        return res.status(400).send({ message: errorMessages.generic });
      }

      const usersQuery = await this.userService.findUsers(['user_id'], [req.params.id]);

      if (usersQuery.rows.length === 0) {
        return res.status(404).send({ message: errorMessages.notFound });
      }

      const { email, username, name } = usersQuery.rows[0];

      return res.status(200).send({
        email, username, name,
      });
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      return res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * GET /api/users
  */
  async getUsers(_req, res) {
    try {
      const usersQuery = await this.userService.getAllUsers();
      const users = usersQuery.rows.map(user => ({
        ...user,
        role_name: roles[user.role_id]
      }));
      
      return res.json({ users })
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      return res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * DELETE /api/user/:id
  */
  async deleteUser(req, res) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }
}

module.exports = UserController;
