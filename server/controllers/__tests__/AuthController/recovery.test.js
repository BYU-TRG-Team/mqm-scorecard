/* eslint-disable no-undef */
const AuthController = require('../../auth.controller');
const TokenHandler = require('../../../support/tokenhandler.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const userService = require('../../__mocks__/userService');
const smtpService = require('../../__mocks__/smtpService');
const tokenService = require('../../__mocks__/tokenService');
const roleService = require('../../__mocks__/roleService');

describe('tests recovery method', () => {
  it('should throw a 400 error for invalid body', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService();
    const mockedTokenService = tokenService();
    const mockedRoleService = roleService();
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      mockedRoleService,
      tokenHandler,
    );

    const req = request({
      body: {
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    await authController.recovery(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ message: 'Body must include email' });
  });

  it('should redirect to /recover/sent but not send a password reset email', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({ findUsers: jest.fn(() => ({ rows: [] })) });
    const mockedTokenService = tokenService();
    const mockedRoleService = roleService();
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      mockedRoleService,
      tokenHandler,
    );

    const req = request({
      body: {
        email: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'redirect');
    jest.spyOn(authController, 'sendPasswordResetEmail');
    await authController.recovery(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/recover/sent');

    expect(authController.sendPasswordResetEmail).toHaveBeenCalledTimes(0);
  });

  it('should redirect to /recover/sent and send a password reset email', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({
      findUsers: jest.fn(() => ({ rows: [{ test: 'test' }] })),
      setAttributes: () => new Promise((resolve) => resolve()),
    });
    const mockedTokenService = tokenService();
    const mockedRoleService = roleService();
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      mockedRoleService,
      tokenHandler,
    );

    const req = request({
      body: {
        email: 'test',
      },
      headers: {
        host: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'redirect');
    jest.spyOn(authController, 'sendPasswordResetEmail');
    await authController.recovery(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/recover/sent');

    expect(authController.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    const mockSendPasswordRestEmail = authController.sendPasswordResetEmail.mock.calls[0];
    expect(mockSendPasswordRestEmail[0]).toStrictEqual(req);
    expect(mockSendPasswordRestEmail[1]).toStrictEqual({ test: 'test' });
  });
});
