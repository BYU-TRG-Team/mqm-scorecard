/* eslint-disable no-undef */
module.exports = (methods) => ({
  findRole: jest.fn(),
  ...methods,
});
