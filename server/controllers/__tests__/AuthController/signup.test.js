/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const AuthController = require('../../auth.controller');
const TokenHandler = require('../../../support/tokenhandler.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const userService = require('../../__mocks__/userService');
const smtpService = require('../../__mocks__/smtpService');
const tokenService = require('../../__mocks__/tokenService');
const roleService = require('../../__mocks__/roleService');

describe('tests signup method', () => {
  it('should throw a 400 error', async () => {
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
        email: 'test',
        password: 'test',
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should create a new user and send a verification email', async () => {
    const mockedSmtpService = smtpService();
    const mockedUserService = userService({ create: jest.fn(() => ({ rows: [{ test: 'test' }] })) });
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
        email: 'test',
        password: 'test',
        name: 'test',
      },
      headers: {
        host: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    jest.spyOn(authController, 'sendVerificationEmail');
    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);

    expect(res.send).toHaveBeenCalledTimes(1);

    expect(authController.sendVerificationEmail).toHaveBeenCalledTimes(1);
    const verificationEmailCall = authController.sendVerificationEmail.mock.calls[0];
    expect(verificationEmailCall[0]).toStrictEqual(req);
    expect(verificationEmailCall[1]).toStrictEqual({ test: 'test' });

    expect(mockedUserService.create).toHaveBeenCalledTimes(1);
    const createUserCall = mockedUserService.create.mock.calls[0];
    expect(createUserCall[0]).toBe(req.body.username);
    expect(createUserCall[1]).toBe(req.body.email);
    expect(createUserCall[3]).toBe(1);
    expect(createUserCall[4]).toBe(req.body.name);

    const passwordIsValid = bcrypt.compareSync(
      'test',
      createUserCall[2],
    );
    expect(passwordIsValid).toBeTruthy();
  });
});
