const authJwt = require('../middleware/auth.middleware');

module.exports = (app, di) => {
  app.post(
    '/api/segment/:segmentId/error',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.SegmentController.createSegmentIssue.bind(di.SegmentController),
  );

  app.delete(
    '/api/segment/error/:issueId',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.SegmentController.deleteSegmentIssue.bind(di.SegmentController),
  );

  app.patch(
    '/api/segment/error/:issueId',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.SegmentController.patchSegmentIssue.bind(di.SegmentController),
  );
};
