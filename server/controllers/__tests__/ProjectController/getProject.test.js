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

describe('tests getProject method', () => {
  it('should successfully get project not assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })),
      getProjectById: jest.fn(() => ({ rows: [{ project_id: 1, source_word_count: 200, target_word_count: 300 }] })),
      getProjectUsersById: jest.fn(() => ({ rows: [{ testUser: 'test' }] })),
    });
    const mockedIssueService = issueService({
      getProjectIssuesById: jest.fn(() => ({
        rows: [{
          issue: 'fluency', parent: 'custom', name: 'Fluency', description: '', notes: '', examples: '',
        },
        {
          issue: 'custom', parent: null, name: 'Custom', description: '', notes: '', examples: '',
        }],
      })),
      getProjectReportById: jest.fn(() => ({
        rows: [
          { issue: 'custom', level: ['critical', 'minor'], type: ['source', 'target'] },
          { issue: 'fluency', level: ['critical', 'minor'], type: ['source', 'target'] },
        ],
      })),
      getSegmentIssuesBySegmentId: jest.fn(() => ({
        rows: [
          {
            type: 'source',
            test: 'test',
          },
          {
            type: 'target',
            test: 'test',
          },
        ],
      })),
    });
    const mockedSegmentService = segmentService({
      getSegmentsByProjectId: jest.fn(() => ({ rows: [{ id: 1 }] })),
    });
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
    jest.spyOn(res, 'json');

    await projectController.getProject(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    const mockJsonCall = res.json.mock.calls[0];
    expect(mockJsonCall[0]).toStrictEqual({
      project: { project_id: 1, source_word_count: 200, target_word_count: 300 },
      apt: 52,
      report: {
        custom: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 2],
        fluency: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 2],
      },
      users: [{ testUser: 'test' }],
      segments: [{
        id: 1,
        sourceErrors: [
          {
            type: 'source',
            test: 'test',
          },
        ],
        targetErrors: [
          {
            type: 'target',
            test: 'test',
          },
        ],
      }],
      issues: {
        custom:
        {
          issue: 'custom',
          parent: null,
          name: 'Custom',
          description: '',
          notes: '',
          examples: '',
          children: {
            fluency: {
              issue: 'fluency',
              parent: 'custom',
              name: 'Fluency',
              description: '',
              notes: '',
              examples: '',
              children: {},
            },
          },
        },
      },
    });
  });

  it('should fail to get project not assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })),
      getProjectById: jest.fn(() => ({ rows: [{ project_id: 1, source_word_count: 200, target_word_count: 300 }] })),
      getProjectUsersById: jest.fn(() => ({ rows: [{ testUser: 'test' }] })),
    });
    const mockedIssueService = issueService({
      getProjectIssuesById: jest.fn(() => ({
        rows: [{
          issue: 'fluency', parent: 'custom', name: 'Fluency', description: '', notes: '', examples: '',
        },
        {
          issue: 'custom', parent: null, name: 'Custom', description: '', notes: '', examples: '',
        }],
      })),
      getProjectReportById: jest.fn(() => ({
        rows: [
          { issue: 'custom', level: ['critical', 'minor'], type: ['source', 'target'] },
          { issue: 'fluency', level: ['critical', 'minor'], type: ['source', 'target'] },
        ],
      })),
      getSegmentIssuesBySegmentId: jest.fn(() => ({
        rows: [
          {
            type: 'source',
            test: 'test',
          },
          {
            type: 'target',
            test: 'test',
          },
        ],
      })),
    });
    const mockedSegmentService = segmentService({
      getSegmentsByProjectId: jest.fn(() => ({ rows: [{ id: 1 }] })),
    });
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
    jest.spyOn(res, 'json');
    jest.spyOn(res, 'status');

    await projectController.getProject(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access Forbidden' });
  });

  it('should successfully get project assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })),
      getProjectById: jest.fn(() => ({ rows: [{ project_id: 1, source_word_count: 200, target_word_count: 300 }] })),
      getProjectUsersById: jest.fn(() => ({ rows: [{ testUser: 'test' }] })),
    });
    const mockedIssueService = issueService({
      getProjectIssuesById: jest.fn(() => ({
        rows: [{
          issue: 'fluency', parent: 'custom', name: 'Fluency', description: '', notes: '', examples: '',
        },
        {
          issue: 'custom', parent: null, name: 'Custom', description: '', notes: '', examples: '',
        }],
      })),
      getProjectReportById: jest.fn(() => ({
        rows: [
          { issue: 'custom', level: ['critical', 'minor'], type: ['source', 'target'] },
          { issue: 'fluency', level: ['critical', 'minor'], type: ['source', 'target'] },
        ],
      })),
      getSegmentIssuesBySegmentId: jest.fn(() => ({
        rows: [
          {
            type: 'source',
            test: 'test',
          },
          {
            type: 'target',
            test: 'test',
          },
        ],
      })),
    });
    const mockedSegmentService = segmentService({
      getSegmentsByProjectId: jest.fn(() => ({ rows: [{ id: 1 }] })),
    });
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
      },
    });

    const res = response();
    jest.spyOn(res, 'json');

    await projectController.getProject(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    const mockJsonCall = res.json.mock.calls[0];
    expect(mockJsonCall[0]).toStrictEqual({
      project: { project_id: 1, source_word_count: 200, target_word_count: 300 },
      apt: 52,
      report: {
        custom: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 2],
        fluency: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 2],
      },
      users: [{ testUser: 'test' }],
      segments: [{
        id: 1,
        sourceErrors: [
          {
            type: 'source',
            test: 'test',
          },
        ],
        targetErrors: [
          {
            type: 'target',
            test: 'test',
          },
        ],
      }],
      issues: {
        custom:
        {
          issue: 'custom',
          parent: null,
          name: 'Custom',
          description: '',
          notes: '',
          examples: '',
          children: {
            fluency: {
              issue: 'fluency',
              parent: 'custom',
              name: 'Fluency',
              description: '',
              notes: '',
              examples: '',
              children: {},
            },
          },
        },
      },
    });
  });
});
