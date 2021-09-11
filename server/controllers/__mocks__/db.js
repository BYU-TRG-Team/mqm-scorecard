/* eslint-disable no-undef */
module.exports = () => ({
  connect() {
    return this;
  },
  query: jest.fn(),
  release: jest.fn(),
});
