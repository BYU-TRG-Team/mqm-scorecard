/* eslint-disable no-undef */
module.exports = (methods) => ({
  create: jest.fn(() => new Promise((resolve) => resolve())),
  deleteToken: jest.fn(),
  findTokens: jest.fn(),
  ...methods,
});
