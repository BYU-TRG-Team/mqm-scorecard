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

describe('tests deleteProject method', () => {
  it('should successfully delete project not assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({ getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })) });
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
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    jest.spyOn(projectController, 'isUserAssignedToProject');

    await projectController.deleteProject(req, res);
    expect(projectController.isUserAssignedToProject).toHaveBeenCalledTimes(1);
    const mockIsUserAssignedCall = projectController.isUserAssignedToProject.mock.calls[0];
    expect(mockIsUserAssignedCall[0]).toStrictEqual(req);
    expect(mockIsUserAssignedCall[1]).toStrictEqual(2);

    expect(mockedProjectService.deleteProjectById).toHaveBeenCalledTimes(1);
    const mockDeleteProjectByIdCall = mockedProjectService.deleteProjectById.mock.calls[0];
    expect(mockDeleteProjectByIdCall[0]).toBe(2);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('should successfully delete project assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({ getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })) });
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
      role: 'admin',
      params: {
        projectId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    jest.spyOn(projectController, 'isUserAssignedToProject');

    await projectController.deleteProject(req, res);
    expect(projectController.isUserAssignedToProject).toHaveBeenCalledTimes(1);
    const mockIsUserAssignedCall = projectController.isUserAssignedToProject.mock.calls[0];
    expect(mockIsUserAssignedCall[0]).toStrictEqual(req);
    expect(mockIsUserAssignedCall[1]).toStrictEqual(1);

    expect(mockedProjectService.deleteProjectById).toHaveBeenCalledTimes(1);
    const mockDeleteProjectByIdCall = mockedProjectService.deleteProjectById.mock.calls[0];
    expect(mockDeleteProjectByIdCall[0]).toBe(1);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('should fail to delete project not assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({ getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })) });
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
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    jest.spyOn(projectController, 'isUserAssignedToProject');

    await projectController.deleteProject(req, res);
    expect(projectController.isUserAssignedToProject).toHaveBeenCalledTimes(1);
    const mockIsUserAssignedCall = projectController.isUserAssignedToProject.mock.calls[0];
    expect(mockIsUserAssignedCall[0]).toStrictEqual(req);
    expect(mockIsUserAssignedCall[1]).toStrictEqual(2);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access Forbidden' });
  });
});
