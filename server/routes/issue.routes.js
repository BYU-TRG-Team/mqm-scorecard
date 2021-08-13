const authJwt = require('../middleware/auth.middleware');

module.exports = (app, di) => {
  app.post(
    '/api/issues',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['superadmin']),
    di.IssueController.updateTypology.bind(di.IssueController),
  );
};
