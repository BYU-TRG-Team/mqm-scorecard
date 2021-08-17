/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const request = require('../../../controllers/__mocks__/request');
const response = require('../../../controllers/__mocks__/response');
const { checkVerification } = require('../../auth.middleware');

describe('tests checkVerification method', () => {
  it('should call next due to verified token', async () => {
    const authToken = jwt.sign({
      id: 1, role: 'superadmin', verified: true, username: 'test', rememberMe: false,
    }, 'test', {
      expiresIn: 604800, //  1 week
    });

    const req = request({
      cookies: {
        scorecard_authtoken: authToken,
      },
    });

    const res = response();
    const next = jest.fn();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    checkVerification(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should fail with 403 due to invalid or unverified token', async () => {
    const authToken = jwt.sign({
      id: 1, role: 'superadmin', verified: false, username: 'test', rememberMe: false,
    }, 'test', {
      expiresIn: 604800, //  1 week
    });

    const req = request({
      cookies: {
        scorecard_authtoken: authToken,
      },
    });

    const res = response();
    const next = jest.fn();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    checkVerification(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Access Forbidden',
    });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
