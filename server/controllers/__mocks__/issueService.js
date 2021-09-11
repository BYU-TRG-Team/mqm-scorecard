/* eslint-disable no-undef */
module.exports = (methods) => ({
  getIssueById: jest.fn(),
  createIssue: jest.fn(),
  createProjectIssue: jest.fn(),
  getProjectIssuesById: jest.fn(),
  deleteIssues: jest.fn(),
  getAllIssues: jest.fn(),
  addSegmentError: jest.fn(),
  getSegmentErrorsBySegmentId: jest.fn(),
  getSegmentErrorsByProjectId: jest.fn(),
  deleteSegmentErrorById: jest.fn(),
  getProjectReportById: jest.fn(),
  ...methods,
});
