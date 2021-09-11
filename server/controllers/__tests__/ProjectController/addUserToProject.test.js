/* eslint-disable no-undef */
const ProjectController = require('../../project.controller');
const IssueParser = require('../../../support/issueparser.support');
const FileParser = require('../../../support/fileparser.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const userService = require('../../__mocks__/userService');
const roleService = require('../../__mocks__/roleService');
const projectService = require('../../__mocks__/projectService');
const issueService = require('../../__mocks__/issueService');
const segmentService = require('../../__mocks__/segmentService');
const db = require('../../__mocks__/db');

describe('tests addUserToProject method', () => {
  it('should fail due to invalid body', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService();
    const mockedSegmentService = segmentService();
    const pgClient = db();
    const fileParser = new FileParser();
    const issueParser = new IssueParser();

    const projectController = new ProjectController(
      pgClient,
      mockedUserService,
      mockedRoleService,
      fileParser,
      mockedProjectService,
      mockedIssueService,
      mockedSegmentService,
      issueParser,
    );

    const req = request({
      body: {
      },
      role: 'superadmin',
      params: {
        projectId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');

    await projectController.addUserToProject(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Body must include a username',
    });
  });

  it('should fail with no user found', async () => {
    const mockedUserService = userService({
      findUsers: jest.fn(() => ({
        rows: [],
      })),
    });
    const mockedRoleService = roleService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [] })),
    });
    const mockedIssueService = issueService();
    const mockedSegmentService = segmentService();
    const pgClient = db();
    const fileParser = new FileParser();
    const issueParser = new IssueParser();

    const projectController = new ProjectController(
      pgClient,
      mockedUserService,
      mockedRoleService,
      fileParser,
      mockedProjectService,
      mockedIssueService,
      mockedSegmentService,
      issueParser,
    );

    const req = request({
      body: {
        username: 'test',
      },
      role: 'superadmin',
      params: {
        projectId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');

    await projectController.addUserToProject(req, res);
    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['username']);
    expect(mockFindUsersCall[1]).toStrictEqual([req.body.username]);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: `No user found with the username "${req.body.username}"`,
    });
  });

  it('should fail since user is already assigned', async () => {
    const mockedUserService = userService({
      findUsers: jest.fn(() => ({
        rows: [{
          user_id: 1,
        }],
      })),
    });
    const mockedRoleService = roleService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [] })),
      // eslint-disable-next-line prefer-promise-reject-errors
      mapUsertoProject: jest.fn(() => new Promise((resolve, reject) => reject({
        code: '23505',
      }))),
    });
    const mockedIssueService = issueService();
    const mockedSegmentService = segmentService();
    const pgClient = db();
    const fileParser = new FileParser();
    const issueParser = new IssueParser();

    const projectController = new ProjectController(
      pgClient,
      mockedUserService,
      mockedRoleService,
      fileParser,
      mockedProjectService,
      mockedIssueService,
      mockedSegmentService,
      issueParser,
    );

    const req = request({
      body: {
        username: 'test',
      },
      role: 'superadmin',
      params: {
        projectId: 1,
      },
    });

    const res = response({
      headersSent: true,
    });
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');

    await projectController.addUserToProject(req, res);
    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['username']);
    expect(mockFindUsersCall[1]).toStrictEqual([req.body.username]);

    expect(mockedProjectService.mapUsertoProject).toHaveBeenCalledTimes(1);
    const mockMapUserToProjectCall = mockedProjectService.mapUsertoProject.mock.calls[0];
    expect(mockMapUserToProjectCall[0]).toBe(1);
    expect(mockMapUserToProjectCall[1]).toBe(1);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: `${req.body.username} has already been assigned to this project`,
    });
  });

  it('should successfully map user to project that is not assigned to it', async () => {
    const mockedUserService = userService({
      findUsers: jest.fn(() => ({
        rows: [{
          user_id: 1,
        }],
      })),
    });
    const mockedRoleService = roleService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [] })),
      mapUsertoProject: jest.fn(() => new Promise((resolve) => resolve())),
    });
    const mockedIssueService = issueService();
    const mockedSegmentService = segmentService();
    const pgClient = db();
    const fileParser = new FileParser();
    const issueParser = new IssueParser();

    const projectController = new ProjectController(
      pgClient,
      mockedUserService,
      mockedRoleService,
      fileParser,
      mockedProjectService,
      mockedIssueService,
      mockedSegmentService,
      issueParser,
    );

    const req = request({
      body: {
        username: 'test',
      },
      role: 'superadmin',
      params: {
        projectId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');

    await projectController.addUserToProject(req, res);
    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['username']);
    expect(mockFindUsersCall[1]).toStrictEqual([req.body.username]);

    expect(mockedProjectService.mapUsertoProject).toHaveBeenCalledTimes(1);
    const mockMapUserToProjectCall = mockedProjectService.mapUsertoProject.mock.calls[0];
    expect(mockMapUserToProjectCall[0]).toBe(1);
    expect(mockMapUserToProjectCall[1]).toBe(1);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('should fail to add user to project that is not assigned to project', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 2 }] })),
    });
    const mockedIssueService = issueService();
    const mockedSegmentService = segmentService();
    const pgClient = db();
    const fileParser = new FileParser();
    const issueParser = new IssueParser();

    const projectController = new ProjectController(
      pgClient,
      mockedUserService,
      mockedRoleService,
      fileParser,
      mockedProjectService,
      mockedIssueService,
      mockedSegmentService,
      issueParser,
    );

    const req = request({
      body: {
        username: 'test',
      },
      role: 'admin',
      params: {
        projectId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');

    await projectController.addUserToProject(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Access Forbidden',
    });
  });

  it('should successfully map user to project that it is assigned to', async () => {
    const mockedUserService = userService({
      findUsers: jest.fn(() => ({
        rows: [{
          user_id: 1,
        }],
      })),
    });
    const mockedRoleService = roleService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({
        rows: [{
          project_id: 1,
        }],
      })),
      mapUsertoProject: jest.fn(() => new Promise((resolve) => resolve())),
    });
    const mockedIssueService = issueService();
    const mockedSegmentService = segmentService();
    const pgClient = db();
    const fileParser = new FileParser();
    const issueParser = new IssueParser();

    const projectController = new ProjectController(
      pgClient,
      mockedUserService,
      mockedRoleService,
      fileParser,
      mockedProjectService,
      mockedIssueService,
      mockedSegmentService,
      issueParser,
    );

    const req = request({
      body: {
        username: 'test',
      },
      role: 'admin',
      params: {
        projectId: 1,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');

    await projectController.addUserToProject(req, res);
    expect(mockedUserService.findUsers).toHaveBeenCalledTimes(1);
    const mockFindUsersCall = mockedUserService.findUsers.mock.calls[0];
    expect(mockFindUsersCall[0]).toStrictEqual(['username']);
    expect(mockFindUsersCall[1]).toStrictEqual([req.body.username]);

    expect(mockedProjectService.mapUsertoProject).toHaveBeenCalledTimes(1);
    const mockMapUserToProjectCall = mockedProjectService.mapUsertoProject.mock.calls[0];
    expect(mockMapUserToProjectCall[0]).toBe(1);
    expect(mockMapUserToProjectCall[1]).toBe(1);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
