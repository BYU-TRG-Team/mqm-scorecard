const bcrypt = require('bcrypt');
const errorMessages = require('../messages/errors.messages');

class UserController {
  constructor(userService, roleService, tokenHandler) {
    this.userService = userService;
    this.roleService = roleService;
    this.tokenHandler = tokenHandler;
  }

  /*
  * PATCH /api/user
  * @username (optional)
  * @email (optional)
  * @name (optional)
  * @password (optional)
  */
  async updateProfile(req, res) {
    try {
      let password;
      const attributes = [];
      const values = [];
      const newAttributes = {};

      Object.keys(req.body).forEach((attr) => {
        if (attr === 'password') {
          password = req.body[attr];
        }

        if (['username', 'email', 'name'].includes(attr)) {
          if (attr === 'username') newAttributes[attr] = req.body[attr];
          attributes.push(attr);
          values.push(req.body[attr]);
        }
      });

      if (password !== undefined) {
        password = await bcrypt.hash(password, 10);
        attributes.push('password');
        values.push(password);
      }

      await this.userService.setAttributes(attributes, values, req.userId);

      const { newToken, cookieOptions } = await this.tokenHandler.generateUpdatedUserAuthToken(req, newAttributes);
      res.cookie('scorecard_authtoken', newToken, cookieOptions);
      res.send({ newToken });
      return;
    } catch (err) {
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * PATCH /api/user/:id
  * @roleId
  */
  async updateUserAdmin(req, res) {
    try {
      const { roleId } = req.body;

      if (roleId === undefined) {
        return res.status(400).send({ message: 'Body must include the attribute roleId' });
      }

      await this.userService.setAttributes(['role_id'], [roleId], req.params.id);
      return res.status(204).send();
    } catch (err) {
      return res.status(500).send({ message: errorMessages.generic });
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
      return res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * GET /api/users
  */
  async getUsers(req, res) {
    try {
      const usersQuery = await this.userService.getAllUsers();
      return res.json({ users: usersQuery.rows });
    } catch (err) {
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
      res.status(500).send({ message: errorMessages.generic });
    }
  }
}

module.exports = UserController;
