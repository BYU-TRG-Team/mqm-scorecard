/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const request = require('../../../controllers/__mocks__/request');
const response = require('../../../controllers/__mocks__/response');
const { verifyToken } = require('../../auth.middleware');

describe('tests verifyToken method', () => {
  it('should call next due to valid token', async () => {
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
    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.userId).toBe(1);
    expect(req.role).toBe('superadmin');
  });

  it('should fail with 401 due to absent jwt token', async () => {
    const req = request({
      cookies: {
        scorecard_authtoken: undefined,
      },
    });

    const res = response();
    const next = jest.fn();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Unauthorized Error',
    });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should fail with 403 due to invalid jwt token', async () => {
    const authToken = jwt.sign({
      id: 1, role: 'superadmin', verified: true, username: 'test', rememberMe: false,
    }, 'INCORRECT SECRET', {
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
    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Access Forbidden',
    });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
