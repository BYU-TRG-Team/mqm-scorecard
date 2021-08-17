/* eslint-disable no-undef */
const jwtDecode = require('jwt-decode');
const bcrypt = require('bcrypt');
const AuthController = require('../../auth.controller');
const TokenHandler = require('../../../support/tokenhandler.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const userService = require('../../__mocks__/userService');
const smtpService = require('../../__mocks__/smtpService');
const tokenService = require('../../__mocks__/tokenService');
const roleService = require('../../__mocks__/roleService');

describe('tests processRecovery method', () => {
  it('should throw a 400 error for non valid body', async () => {
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
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await authController.processRecovery(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Body must include password' });
  });

  it('should throw a 400 error for non valid token', async () => {
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
        password: 'test',
      },
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    await authController.processRecovery(req, res);

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
        password: 'test',
      },
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    jest.spyOn(tokenHandler, 'isPasswordTokenExpired');
    await authController.processRecovery(req, res);

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

  it('should successfully update password and return token and cookie', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({
      findUsers: jest.fn(() => ({
        rows: [{
          reset_password_token_created_at: 3093496462800000, user_id: 1, verified: true, role_id: 1, username: 'test',
        }],
      })),
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
        password: 'test',
      },
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'cookie');
    jest.spyOn(res, 'send');
    jest.spyOn(tokenHandler, 'isPasswordTokenExpired');
    await authController.processRecovery(req, res);

    expect(tokenHandler.isPasswordTokenExpired).toHaveBeenCalledTimes(1);
    const mockPasswordTokenExpiredCall = tokenHandler.isPasswordTokenExpired.mock.calls[0];
    expect(mockPasswordTokenExpiredCall[0]).toStrictEqual({
      reset_password_token_created_at: 3093496462800000, user_id: 1, verified: true, role_id: 1, username: 'test',
    });

    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['reset_password_token']);
    expect(mockFindUsersCall[1]).toStrictEqual(['test']);

    expect(mockedUserService.setAttributes).toHaveBeenCalledTimes(1);
    const mockSetAttributesCall = mockedUserService.setAttributes.mock.calls[0];
    expect(mockSetAttributesCall[0]).toStrictEqual(['password', 'reset_password_token']);
    expect(bcrypt.compareSync(
      'test',
      mockSetAttributesCall[1][0],
    )).toBeTruthy();
    expect(mockSetAttributesCall[1][1]).toBe('');
    expect(mockSetAttributesCall[2]).toBe(1);

    expect(res.cookie).toBeCalledTimes(1);
    const mockCookieCall = res.cookie.mock.calls[0];
    expect(mockCookieCall[0]).toBe('scorecard_authtoken');
    expect(jwtDecode(mockCookieCall[1])).toMatchObject({
      id: 1,
      role: 'user',
      verified: true,
      username: 'test',
      rememberMe: false,
    });
    expect(mockCookieCall[2]).toMatchObject({
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    });

    expect(res.send).toBeCalledTimes(1);
    const mockSendCall = res.send.mock.calls[0];
    expect(jwtDecode(mockSendCall[0].token)).toMatchObject({
      id: 1,
      role: 'user',
      verified: true,
      username: 'test',
      rememberMe: false,
    });
  });
});
