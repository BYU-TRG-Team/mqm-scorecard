module.exports = (app, di) => {
  app.post('/api/auth/signup', di.AuthController.signup.bind(di.AuthController));

  app.post('/api/auth/signin', di.AuthController.signin.bind(di.AuthController));

  app.get('/api/auth/logout', di.AuthController.logout.bind(di.AuthController));

  app.get('/api/auth/verify/:token', di.AuthController.verify.bind(di.AuthController));

  app.post('/api/auth/recovery', di.AuthController.recovery.bind(di.AuthController));

  app.get('/api/auth/recovery/verify/:token', di.AuthController.verifyRecovery.bind(di.AuthController));

  app.post('/api/auth/recovery/:token', di.AuthController.processRecovery.bind(di.AuthController));
};
