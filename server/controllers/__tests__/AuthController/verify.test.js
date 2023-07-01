/* eslint-disable no-undef */
const AuthController = require('../../auth.controller');
const TokenHandler = require('../../../support/tokenhandler.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const userService = require('../../__mocks__/userService');
const smtpService = require('../../__mocks__/smtpService');
const tokenService = require('../../__mocks__/tokenService');

describe('tests verify method', () => {
  it('should redirect to /login for invalid verify token', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService();
    const mockedTokenService = tokenService({ findTokens: jest.fn(() => ({ rows: [] })) });
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      tokenHandler,
    );

    const req = request({
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'redirect');
    await authController.verify(req, res);

    expect(mockedTokenService.findTokens).toBeCalledTimes(1);
    const mockFindTokensCall = mockedTokenService.findTokens.mock.calls[0];
    expect(mockFindTokensCall[0]).toStrictEqual(['token']);
    expect(mockFindTokensCall[1]).toStrictEqual(['test']);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/login');
  });

  it('should throw a 500 error token with no associated user', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({ findUsers: jest.fn(() => ({ rows: [] })) });
    const mockedTokenService = tokenService({ findTokens: jest.fn(() => ({ rows: [{ user_id: 1 }] })) });
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      tokenHandler,
    );

    const req = request({
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    await authController.verify(req, res);

    expect(mockedTokenService.findTokens).toBeCalledTimes(1);
    const mockFindTokensCall = mockedTokenService.findTokens.mock.calls[0];
    expect(mockFindTokensCall[0]).toStrictEqual(['token']);
    expect(mockFindTokensCall[1]).toStrictEqual(['test']);

    expect(mockedUserService.findUsers).toBeCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['user_id']);
    expect(mockFindUsersCall[1]).toStrictEqual([1]);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ message: 'Something went wrong on our end. Please try again.' });
  });

  it('should set user as verified, remove token, and redirect to /login', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({ findUsers: jest.fn(() => ({ rows: [{ user_id: 1 }] })) });
    const mockedTokenService = tokenService({ findTokens: jest.fn(() => ({ rows: [{ user_id: 1, token: 'test' }] })) });
    const tokenHandler = new TokenHandler();

    const authController = new AuthController(
      mockedSmtpService,
      mockedUserService,
      mockedTokenService,
      tokenHandler,
    );

    const req = request({
      params: {
        token: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'redirect');
    await authController.verify(req, res);

    expect(mockedTokenService.findTokens).toBeCalledTimes(1);
    const mockFindTokensCall = mockedTokenService.findTokens.mock.calls[0];
    expect(mockFindTokensCall[0]).toStrictEqual(['token']);
    expect(mockFindTokensCall[1]).toStrictEqual(['test']);

    expect(mockedUserService.findUsers).toBeCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['user_id']);
    expect(mockFindUsersCall[1]).toStrictEqual([1]);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    const mockRedirectCall = res.redirect.mock.calls[0];
    expect(mockRedirectCall[0]).toBe('/login');

    expect(mockedUserService.setAttributes).toBeCalledTimes(1);
    const mockSetAttributesCall = mockedUserService.setAttributes.mock.calls[0];
    expect(mockSetAttributesCall[0]).toStrictEqual(['verified']);
    expect(mockSetAttributesCall[1]).toStrictEqual([true]);
    expect(mockSetAttributesCall[2]).toBe(1);

    expect(mockedTokenService.deleteToken).toBeCalledTimes(1);
    const mockDeleteTokenCall = mockedTokenService.deleteToken.mock.calls[0];
    expect(mockDeleteTokenCall[0]).toBe('test');
  });
});
