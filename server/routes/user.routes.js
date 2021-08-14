const authJwt = require('../middleware/auth.middleware');

module.exports = (app, di) => {
  app.get(
    '/api/user/:id',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.UserController.getUser.bind(di.UserController),
  );

  app.get(
    '/api/users',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['superadmin']),
    di.UserController.getUsers.bind(di.UserController),
  );

  app.patch(
    '/api/user/:id',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.UserController.updateUser.bind(di.UserController),
  );

  app.delete(
    '/api/user/:id',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['superadmin']),
    di.UserController.deleteUser.bind(di.UserController),
  );
};
