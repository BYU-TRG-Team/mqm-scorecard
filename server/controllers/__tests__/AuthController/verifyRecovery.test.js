/* eslint-disable no-undef */
const AuthController = require('../../auth.controller');
const TokenHandler = require('../../../support/tokenhandler.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const userService = require('../../__mocks__/userService');
const smtpService = require('../../__mocks__/smtpService');
const tokenService = require('../../__mocks__/tokenService');

describe('tests verifyRecovery method', () => {
  it('should throw a 400 error for non valid token', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({ findUsers: jest.fn(() => ({ rows: [] })) });
    const mockedTokenService = tokenService();
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      tokenHandler,
    );

    const req = request({
      body: {
      },
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    await authController.verifyRecovery(req, res);

    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['reset_password_token']);
    expect(mockFindUsersCall[1]).toStrictEqual(['test']);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ message: 'Something went wrong on our end. Please try again.' });
  });

  it('should throw a 400 error for expired token', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({ findUsers: jest.fn(() => ({ rows: [{ reset_password_token_created_at: 0 }] })) });
    const mockedTokenService = tokenService();
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      tokenHandler,
    );

    const req = request({
      body: {
      },
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    jest.spyOn(tokenHandler, 'isPasswordTokenExpired');
    await authController.verifyRecovery(req, res);

    expect(tokenHandler.isPasswordTokenExpired).toHaveBeenCalledTimes(1);
    const mockPasswordTokenExpiredCall = tokenHandler.isPasswordTokenExpired.mock.calls[0];
    expect(mockPasswordTokenExpiredCall[0]).toStrictEqual({ reset_password_token_created_at: 0 });

    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['reset_password_token']);
    expect(mockFindUsersCall[1]).toStrictEqual(['test']);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ message: 'Something went wrong on our end. Please try again.' });
  });

  it('should redirect to /recover/test', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({ findUsers: jest.fn(() => ({ rows: [{ reset_password_token_created_at: 3093496462800000 }] })) });
    const mockedTokenService = tokenService();
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      tokenHandler,
    );

    const req = request({
      body: {
      },
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'redirect');
    jest.spyOn(tokenHandler, 'isPasswordTokenExpired');
    await authController.verifyRecovery(req, res);

    expect(tokenHandler.isPasswordTokenExpired).toHaveBeenCalledTimes(1);
    const mockPasswordTokenExpiredCall = tokenHandler.isPasswordTokenExpired.mock.calls[0];
    expect(mockPasswordTokenExpiredCall[0]).toStrictEqual({ reset_password_token_created_at: 3093496462800000 });

    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['reset_password_token']);
    expect(mockFindUsersCall[1]).toStrictEqual(['test']);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    const mockRedirectCall = res.redirect.mock.calls[0];
    expect(mockRedirectCall[0]).toBe('/recover/test');
  });
});
