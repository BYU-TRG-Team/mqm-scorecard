/* eslint-disable no-undef */
const ProjectController = require('../../project.controller');
const IssueParser = require('../../../support/issueparser.support');
const FileParser = require('../../../support/fileparser.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const userService = require('../../__mocks__/userService');
const projectService = require('../../__mocks__/projectService');
const issueService = require('../../__mocks__/issueService');
const segmentService = require('../../__mocks__/segmentService');
const db = require('../../__mocks__/db');

describe('tests deleteUserFromAllProjects method', () => {
  it('should successfully delete user from all projects', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService();
    const mockedSegmentService = segmentService();
    const pgClient = db();
    const fileParser = new FileParser();
    const issueParser = new IssueParser();

    const projectController = new ProjectController(
      pgClient,
      mockedUserService,
      fileParser,
      mockedProjectService,
      mockedIssueService,
      mockedSegmentService,
      issueParser,
    );

    const req = request({
      body: {
        name: 'test',
      },
      role: 'superadmin',
      params: {
        userId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');

    await projectController.deleteUserFromAllProjects(req, res);
    expect(mockedProjectService.deleteUserFromAllProjects).toHaveBeenCalledTimes(1);
    const mockDeleteUserFromAllProjectsCall = mockedProjectService.deleteUserFromAllProjects.mock.calls[0];
    expect(mockDeleteUserFromAllProjectsCall[0]).toBe(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
