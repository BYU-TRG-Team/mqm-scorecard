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

describe('tests getProjectJSONReport method', () => {
  it('should successfully get project not assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })),
      getProjectById: jest.fn(() => ({
        rows: [{
          project_id: 1, source_word_count: 200, target_word_count: 300, name: 'test',
        }],
      })),
    });
    const mockedIssueService = issueService({
      getProjectIssuesById: jest.fn(() => ({
        rows: [
          {
            issue: 'locale-specific-punctuation',
            parent: null,
            name: 'locale-specific punctuation',
            description: 'The text systematically uses punctuation marks that are not appropriate for the specified locale.',
            notes: '',
            examples: 'A text translated from English to Japanese maintains European-style punctuation—such as full-stops (.)—instead of using the appropriate Japanese punctuation, such as the Japanese full stop (。).',
          },
          {
            issue: 'national-language-standard',
            parent: 'locale-specific-punctuation',
            name: 'national language standard',
            description: 'A text violates national language standards.',
            notes: '',
            examples: 'A French advertising text uses anglicisms that are forbidden for print texts by the Academie française specifications.',
          },
          {
            issue: 'shortcut-key',
            parent: null,
            name: 'shortcut key',
            description: 'A translated software product uses shortcuts that do not conform to locale expectations or that make no sense for the locale.',
            notes: 'Very often this error indicates an underlying internationalization root cause.',
            examples: 'A software product uses CTRL-S to save a file in Hungarian, rather than the appropriate CTRL-M (for mentenni).',
          },
        ],
      })),
      getSegmentIssuesByProjectId: jest.fn(() => ({
        rows: [
          {
            segment_id: 1,
            type: 'target',
            issue_name: 'Fluency',
            level: 'minor',
            id: 1,
            issue: 'fluency',
            note: 'test',
            highlight_start_index: 0,
            highlight_end_index: 10,
          },
        ],
      })),
      getProjectReportById: jest.fn(() => ({
        rows: [
          {
            level: ['critical'],
          },
          {
            level: ['minor'],
          },
        ],
      })),
    });
    const mockedSegmentService = segmentService({
      getSegmentsByProjectId: jest.fn(() => ({
        rows: [{
          id: 1,
          segment_num: 1,
          segment_data: {
            Source: 'Test1',
            Target: 'Test2',
          },
        }],
      })),
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

    await projectController.getProjectJSONReport(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    const mockResJsonCall = res.json.mock.calls[0];
    expect(mockResJsonCall[0]).toStrictEqual({
      projectName: 'test',
      key: { 1: '1' },
      errors: [{
        segment: '1',
        target: 'target',
        name: 'Fluency',
        severity: 'minor',
        issueReportId: '1',
        issueId: 'fluency',
        note: 'test',
        highlighting: { startIndex: 0, endIndex: 10 },
      }],
      scores: { compositeScore: '91.33' },
      segments: {
        source: ['Test1'],
        target: ['Test2'],
      },
      metric: [
        {
          issueId: 'locale-specific-punctuation',
          parent: null,
          name: 'locale-specific punctuation',
          description: 'The text systematically uses punctuation marks that are not appropriate for the specified locale.',
          notes: '',
          examples: 'A text translated from English to Japanese maintains European-style punctuation—such as full-stops (.)—instead of using the appropriate Japanese punctuation, such as the Japanese full stop (。).',
        },
        {
          issueId: 'national-language-standard',
          parent: 'locale-specific-punctuation',
          name: 'national language standard',
          description: 'A text violates national language standards.',
          notes: '',
          examples: 'A French advertising text uses anglicisms that are forbidden for print texts by the Academie française specifications.',
        },
        {
          issueId: 'shortcut-key',
          parent: null,
          name: 'shortcut key',
          description: 'A translated software product uses shortcuts that do not conform to locale expectations or that make no sense for the locale.',
          notes: 'Very often this error indicates an underlying internationalization root cause.',
          examples: 'A software product uses CTRL-S to save a file in Hungarian, rather than the appropriate CTRL-M (for mentenni).',
        },
      ],
    });
  });

  it('should successfully get project assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 2 }] })),
      getProjectById: jest.fn(() => ({
        rows: [{
          project_id: 1, source_word_count: 200, target_word_count: 300, name: 'test',
        }],
      })),
    });
    const mockedIssueService = issueService({
      getProjectIssuesById: jest.fn(() => ({
        rows: [
          {
            issue: 'locale-specific-punctuation',
            parent: null,
            name: 'locale-specific punctuation',
            description: 'The text systematically uses punctuation marks that are not appropriate for the specified locale.',
            notes: '',
            examples: 'A text translated from English to Japanese maintains European-style punctuation—such as full-stops (.)—instead of using the appropriate Japanese punctuation, such as the Japanese full stop (。).',
          },
          {
            issue: 'national-language-standard',
            parent: 'locale-specific-punctuation',
            name: 'national language standard',
            description: 'A text violates national language standards.',
            notes: '',
            examples: 'A French advertising text uses anglicisms that are forbidden for print texts by the Academie française specifications.',
          },
          {
            issue: 'shortcut-key',
            parent: null,
            name: 'shortcut key',
            description: 'A translated software product uses shortcuts that do not conform to locale expectations or that make no sense for the locale.',
            notes: 'Very often this error indicates an underlying internationalization root cause.',
            examples: 'A software product uses CTRL-S to save a file in Hungarian, rather than the appropriate CTRL-M (for mentenni).',
          },
        ],
      })),
      getSegmentIssuesByProjectId: jest.fn(() => ({
        rows: [
          {
            segment_id: 1,
            type: 'target',
            issue_name: 'Fluency',
            level: 'minor',
            id: 1,
            issue: 'fluency',
            note: 'test',
            highlight_start_index: 0,
            highlight_end_index: 10,
          },
        ],
      })),
      getProjectReportById: jest.fn(() => ({
        rows: [
          {
            level: ['critical'],
          },
          {
            level: ['minor'],
          },
        ],
      })),
    });
    const mockedSegmentService = segmentService({
      getSegmentsByProjectId: jest.fn(() => ({
        rows: [{
          id: 1,
          segment_num: 1,
          segment_data: {
            Source: 'Test1',
            Target: 'Test2',
          },
        }],
      })),
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

    await projectController.getProjectJSONReport(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    const mockResJsonCall = res.json.mock.calls[0];
    expect(mockResJsonCall[0]).toStrictEqual({
      projectName: 'test',
      key: { 1: '1' },
      errors: [{
        segment: '1',
        target: 'target',
        name: 'Fluency',
        severity: 'minor',
        issueReportId: '1',
        issueId: 'fluency',
        note: 'test',
        highlighting: { startIndex: 0, endIndex: 10 },
      }],
      scores: { compositeScore: '91.33' },
      segments: {
        source: ['Test1'],
        target: ['Test2'],
      },
      metric: [
        {
          issueId: 'locale-specific-punctuation',
          parent: null,
          name: 'locale-specific punctuation',
          description: 'The text systematically uses punctuation marks that are not appropriate for the specified locale.',
          notes: '',
          examples: 'A text translated from English to Japanese maintains European-style punctuation—such as full-stops (.)—instead of using the appropriate Japanese punctuation, such as the Japanese full stop (。).',
        },
        {
          issueId: 'national-language-standard',
          parent: 'locale-specific-punctuation',
          name: 'national language standard',
          description: 'A text violates national language standards.',
          notes: '',
          examples: 'A French advertising text uses anglicisms that are forbidden for print texts by the Academie française specifications.',
        },
        {
          issueId: 'shortcut-key',
          parent: null,
          name: 'shortcut key',
          description: 'A translated software product uses shortcuts that do not conform to locale expectations or that make no sense for the locale.',
          notes: 'Very often this error indicates an underlying internationalization root cause.',
          examples: 'A software product uses CTRL-S to save a file in Hungarian, rather than the appropriate CTRL-M (for mentenni).',
        },
      ],
    });
  });

  it('should fail to get project not assigned to user', async () => {
    const mockedUserService = userService();
    const mockedProjectService = projectService({
      getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 1 }] })),
      getProjectById: jest.fn(() => ({
        rows: [{
          project_id: 1, source_word_count: 200, target_word_count: 300, name: 'test',
        }],
      })),
    });
    const mockedIssueService = issueService({
      getSegmentIssuesByProjectId: jest.fn(() => ({
        rows: [
          {
            segment_id: 1,
            type: 'target',
            issue_name: 'Fluency',
            level: 'minor',
            id: 1,
            issue: 'fluency',
            note: 'test',
            highlight_start_index: 0,
            highlight_end_index: 10,
          },
        ],
      })),
      getProjectReportById: jest.fn(() => ({
        rows: [
          {
            level: ['critical'],
          },
          {
            level: ['minor'],
          },
        ],
      })),
    });
    const mockedSegmentService = segmentService({
      getSegmentsByProjectId: jest.fn(() => ({
        rows: [{
          id: 1,
          segment_num: 1,
          segment_data: {
            Source: 'Test1',
            Target: 'Test2',
          },
        }],
      })),
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

    await projectController.getProjectJSONReport(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Access Forbidden',
    });
  });
});
