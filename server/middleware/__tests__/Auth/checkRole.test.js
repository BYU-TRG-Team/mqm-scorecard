/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const request = require('../../../controllers/__mocks__/request');
const response = require('../../../controllers/__mocks__/response');
const { checkRole } = require('../../auth.middleware');

describe('tests checkRole method', () => {
  it('should call next due to token including specified role', async () => {
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
    checkRole(['user', 'superadmin'])(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(0);
    expect(res.send).toHaveBeenCalledTimes(0);
  });

  it('should fail with a 403 for token not including specified role', async () => {
    const authToken = jwt.sign({
      id: 1, role: 'admin', verified: true, username: 'test', rememberMe: false,
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
    checkRole(['user', 'superadmin'])(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Access Forbidden',
    });
  });
});
