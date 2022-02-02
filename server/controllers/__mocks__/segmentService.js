/* eslint-disable no-undef */
module.exports = (methods) => ({
  createSegments: jest.fn(),
  deleteSegments: jest.fn(),
  getSegmentsByProjectId: jest.fn(),
  getSegmentById: jest.fn(),
  getSegmentByIssueId: jest.fn(),
  setSegmentAttributes: jest.fn(),
  ...methods,
});
