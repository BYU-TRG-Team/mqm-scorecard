/* eslint-disable no-undef */
const isEqual = require('lodash.isequal');
const cloneDeep = require('lodash.clonedeep');
const userService = require('../../__mocks__/userService');
const roleService = require('../../__mocks__/roleService');
const tokenHandler = require('../../../support/tokenhandler.support');
const UserController = require('../../user.controller');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');

expect.extend({
  toBeArrayWithElements(received, comparedArray) {
    const pass = isEqual(cloneDeep(received).sort(), cloneDeep(comparedArray).sort());
    const message = () => `expected ${received} to contain the same elements as ${comparedArray}`;
    return {
      message,
      pass,
    };
  },
});

describe('tests updateUser method', () => {
  it('should update the user profile once with username, email, name, and password', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();

    const userController = new UserController(
      mockedUserService,
      mockedRoleService,
      tokenHandler,
    );

    const req = request({
      body: {
        username: 'test',
        email: 'test@test.com',
        name: 'Test',
        password: 'test',
        roleId: '1',
        testAttr: 'test',
      },
      params: {
        id: 10,
      },
      role: 'user',
    });

    const res = response();
    await userController.updateUser(req, res);

    expect(mockedUserService.setAttributes).toHaveBeenCalledTimes(1);
    const firstCall = mockedUserService.setAttributes.mock.calls[0];
    expect(firstCall[0]).toBeArrayWithElements(['username', 'email', 'name', 'password']);
    firstCall[0].forEach((attr, index) => {
      if (attr !== 'password') {
        expect(firstCall[1][index]).toBe(req.body[attr]);
      }
    });
    expect(firstCall[2]).toBe(10);
  });

  it('should update the user profile once with username, email, name, and password, and then a second time with roleId', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();

    const userController = new UserController(
      mockedUserService,
      mockedRoleService,
      tokenHandler,
    );

    const req = request({
      body: {
        username: 'test',
        email: 'test@test.com',
        name: 'Test',
        password: 'test',
        roleId: '1',
        testAttr: 'test',
      },
      params: {
        id: 10,
      },
      role: 'superadmin',
    });

    const res = response();
    await userController.updateUser(req, res);

    expect(mockedUserService.setAttributes).toHaveBeenCalledTimes(2);
    const firstCall = mockedUserService.setAttributes.mock.calls[0];
    expect(firstCall[0]).toBeArrayWithElements(['username', 'email', 'name', 'password']);
    firstCall[0].forEach((attr, index) => {
      if (attr !== 'password') {
        expect(firstCall[1][index]).toBe(req.body[attr]);
      }
    });
    expect(firstCall[2]).toBe(10);

    const secondCall = mockedUserService.setAttributes.mock.calls[1];
    expect(secondCall[0]).toBeArrayWithElements(['role_id']);
    secondCall[0].forEach((attr, index) => {
      if (attr === 'role_id') {
        expect(secondCall[1][index]).toBe(req.body.roleId);
        return;
      }

      expect(secondCall[1][index]).toBe(req.body[attr]);
    });
    expect(secondCall[2]).toBe(10);
  });

  it('should update the user profile once with roleId', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();

    const userController = new UserController(
      mockedUserService,
      mockedRoleService,
      tokenHandler,
    );

    const req = request({
      body: {
        roleId: '1',
      },
      params: {
        id: 10,
      },
      role: 'superadmin',
    });

    const res = response();
    await userController.updateUser(req, res);

    expect(mockedUserService.setAttributes).toHaveBeenCalledTimes(1);
    const firstCall = mockedUserService.setAttributes.mock.calls[0];
    expect(firstCall[0]).toBeArrayWithElements(['role_id']);
    firstCall[0].forEach((attr, index) => {
      if (attr === 'role_id') {
        expect(firstCall[1][index]).toBe(req.body.roleId);
        return;
      }

      expect(firstCall[1][index]).toBe(req.body[attr]);
    });
    expect(firstCall[2]).toBe(10);
  });
});
