/* eslint-disable no-undef */
module.exports = (methods) => ({
  sendEmail: jest.fn(() => new Promise((resolve) => resolve())),
  ...methods,
});
