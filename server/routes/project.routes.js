const authJwt = require('../middleware/auth.middleware');

module.exports = (app, di) => {
  app.post(
    '/api/project',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['superadmin', 'admin']),
    di.ProjectController.createProject.bind(di.ProjectController),
  );

  app.get(
    '/api/project/:projectId/report',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.ProjectController.getProjectReport.bind(di.ProjectController),
  );

  app.get(
    '/api/projects',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.ProjectController.getProjects.bind(di.ProjectController),
  );

  app.delete(
    '/api/project/:projectId',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['admin', 'superadmin']),
    di.ProjectController.deleteProject.bind(di.ProjectController),
  );

  app.get(
    '/api/project/:projectId',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.ProjectController.getProject.bind(di.ProjectController),
  );

  app.delete(
    '/api/project/:projectId/user/:userId',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['admin', 'superadmin']),
    di.ProjectController.deleteUserFromProject.bind(di.ProjectController),
  );

  app.delete(
    '/api/user/:userId/projects',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['superadmin']),
    di.ProjectController.deleteUserFromAllProjects.bind(di.ProjectController),
  );

  app.post(
    '/api/project/:projectId/user',
    authJwt.verifyToken,
    authJwt.checkVerification,
    authJwt.checkRole(['admin', 'superadmin']),
    di.ProjectController.addUserToProject.bind(di.ProjectController),
  );

  app.put(
    '/api/project/:projectId',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.ProjectController.updateProject.bind(di.ProjectController),
  );
};
