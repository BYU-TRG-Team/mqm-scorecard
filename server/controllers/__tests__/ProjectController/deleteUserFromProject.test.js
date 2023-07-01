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

describe('tests deleteUserFromProject method', () => {
  it('should successfully delete project that is not assigned to the user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })),
    });
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
        projectId: 2,
        userId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');

    await projectController.deleteUserFromProject(req, res);
    expect(mockedProjectService.deleteUserFromProject).toHaveBeenCalledTimes(1);
    const mockDeleteUserFromProjectCall = mockedProjectService.deleteUserFromProject.mock.calls[0];
    expect(mockDeleteUserFromProjectCall[0]).toBe(1);
    expect(mockDeleteUserFromProjectCall[1]).toBe(2);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('should successfully delete project that is assigned to the user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })),
    });
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
      role: 'user',
      params: {
        projectId: 1,
        userId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');

    await projectController.deleteUserFromProject(req, res);
    expect(mockedProjectService.deleteUserFromProject).toHaveBeenCalledTimes(1);
    const mockDeleteUserFromProjectCall = mockedProjectService.deleteUserFromProject.mock.calls[0];
    expect(mockDeleteUserFromProjectCall[0]).toBe(1);
    expect(mockDeleteUserFromProjectCall[1]).toBe(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('should fail to delete project that is not assigned to the user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })),
    });
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
      role: 'user',
      params: {
        projectId: 2,
        userId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');

    await projectController.deleteUserFromProject(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Access Forbidden',
    });
  });
});
