/* eslint-disable no-undef */
module.exports = (methods) => ({
  getIssueById: jest.fn(),
  createIssue: jest.fn(),
  createProjectIssue: jest.fn(),
  getProjectIssuesById: jest.fn(),
  deleteIssues: jest.fn(),
  getAllIssues: jest.fn(),
  addSegmentIssue: jest.fn(),
  getSegmentIssuesBySegmentId: jest.fn(),
  getSegmentIssuesByProjectId: jest.fn(),
  deleteSegmentIssueById: jest.fn(),
  getProjectReportById: jest.fn(),
  ...methods,
});
