const authJwt = require('../middleware/auth.middleware');

module.exports = (app, di) => {
  app.post(
    '/api/issues',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['superadmin']),
    di.IssueController.updateTypology.bind(di.IssueController),
  );

  app.get(
    '/api/issues',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['admin', 'superadmin']),
    di.IssueController.getTypology.bind(di.IssueController),
  );
};
