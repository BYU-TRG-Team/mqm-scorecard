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

describe('tests getProjects method', () => {
  it('should successfully return all projects', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService({ getAllProjects: jest.fn(() => ({ rows: [{ test: 'test' }] })) });
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
        name: 'test',
      },
      role: 'superadmin',

    });

    const res = response();
    jest.spyOn(res, 'json');
    await projectController.getProjects(req, res);

    expect(mockedProjectService.getAllProjects).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledTimes(1);
    const mockJsonCall = res.json.mock.calls[0];
    expect(mockJsonCall[0]).toStrictEqual({ projects: [{ test: 'test' }] });
  });

  it('should successfully return all projects for a specific user', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService({ getProjectsByUserId: jest.fn(() => ({ rows: [{ test: 'test' }] })) });
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
        name: 'test',
      },
      role: 'admin',
      userId: 1,
    });

    const res = response();
    jest.spyOn(res, 'json');
    await projectController.getProjects(req, res);

    expect(mockedProjectService.getProjectsByUserId).toHaveBeenCalledTimes(1);
    const mockGetProjectsByUserId = mockedProjectService.getProjectsByUserId.mock.calls[0];
    expect(mockGetProjectsByUserId[0]).toBe(req.userId);

    expect(res.json).toHaveBeenCalledTimes(1);
    const mockJsonCall = res.json.mock.calls[0];
    expect(mockJsonCall[0]).toStrictEqual({ projects: [{ test: 'test' }] });
  });
});
