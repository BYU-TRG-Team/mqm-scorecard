const authJwt = require('../middleware/auth.middleware');

module.exports = (app, di) => {
  app.post(
    '/api/segment/:segmentId/error',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.SegmentController.createSegmentError.bind(di.SegmentController),
  );

  app.delete(
    '/api/segment/error/:errorId',
    authJwt.verifyToken,
    authJwt.checkVerification,
    di.SegmentController.deleteSegmentError.bind(di.SegmentController),
  );
};
