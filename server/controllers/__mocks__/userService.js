/* eslint-disable no-undef */
module.exports = (methods) => ({
  create: jest.fn(),
  setAttributes: jest.fn(),
  findUsers: jest.fn(),
  getAllUsers: jest.fn(),
  deleteUser: jest.fn(),
  ...methods,
});
