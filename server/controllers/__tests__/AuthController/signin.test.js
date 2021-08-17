/* eslint-disable no-bitwise */
/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const jwtDecode = require('jwt-decode');
const AuthController = require('../../auth.controller');
const TokenHandler = require('../../../support/tokenhandler.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const userService = require('../../__mocks__/userService');
const smtpService = require('../../__mocks__/smtpService');
const tokenService = require('../../__mocks__/tokenService');
const roleService = require('../../__mocks__/roleService');

describe('tests signin method', () => {
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
        username: 'test',
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    await authController.signin(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ message: 'Body must include a username and password' });
  });

  it('should throw a 400 error for no found user', async () => {
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
        username: 'test',
        password: 'test',
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    await authController.signin(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const findUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(findUsersCall[0]).toStrictEqual(['username']);
    expect(findUsersCall[1]).toStrictEqual([req.body.username]);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ message: 'Username or password is incorrect. Please try again.' });
  });

  it('should throw a 400 error for invalid password', async () => {
    const hashedPassword = await bcrypt.hash('tes', 10);
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({ findUsers: jest.fn(() => ({ rows: [{ password: hashedPassword }] })) });
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
        username: 'test',
        password: 'test',
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    await authController.signin(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const findUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(findUsersCall[0]).toStrictEqual(['username']);
    expect(findUsersCall[1]).toStrictEqual([req.body.username]);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ message: 'Username or password is incorrect. Please try again.' });
  });

  it('should successfully create a jwt token with rememberMe as false', async () => {
    const hashedPassword = await bcrypt.hash('test', 10);
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({
      findUsers: jest.fn(() => ({
        rows: [{
          password: hashedPassword, user_id: 1, role_id: 1, verified: true, username: 'test',
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
        username: 'test',
        password: 'test',
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'cookie');
    jest.spyOn(res, 'json');
    await authController.signin(req, res);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    [mockResCookieCall] = res.cookie.mock.calls;
    expect(mockResCookieCall[0]).toBe('scorecard_authtoken');
    expect(jwtDecode(mockResCookieCall[1])).toMatchObject({
      id: 1,
      role: 'user',
      verified: true,
      username: 'test',
      rememberMe: false,
    });
    expect(mockResCookieCall[2]).toMatchObject({
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    });

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ token: mockResCookieCall[1] });
  });

  it('should successfully create a jwt token with rememberMe as true', async () => {
    const hashedPassword = await bcrypt.hash('test', 10);
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({
      findUsers: jest.fn(() => ({
        rows: [{
          password: hashedPassword, user_id: 1, role_id: 1, verified: true, username: 'test',
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
        username: 'test',
        password: 'test',
        rememberMe: true,
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'cookie');
    jest.spyOn(res, 'json');
    await authController.signin(req, res);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    [mockResCookieCall] = res.cookie.mock.calls;
    expect(mockResCookieCall[0]).toBe('scorecard_authtoken');
    expect(jwtDecode(mockResCookieCall[1])).toMatchObject({
      id: 1,
      role: 'user',
      verified: true,
      username: 'test',
      rememberMe: true,
    });
    expect(mockResCookieCall[2]).toMatchObject({
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    });

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ token: mockResCookieCall[1] });
  });
});
