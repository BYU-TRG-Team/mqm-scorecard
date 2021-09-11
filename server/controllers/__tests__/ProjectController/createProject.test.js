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
const bitextFile = require('../../__mocks__/bitextFile');
const metricFile = require('../../__mocks__/metricFile');
const specificationsFile = require('../../__mocks__/specificationsFile');

describe('tests createProject method', () => {
  it('should throw a 400 error for non valid body', async () => {
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
        name: 'test',
      },
      files: {
        bitextFile: 'test',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Insufficient files submitted: Request requires a project name, metric file, and bi-text file' });
  });

  // Metric file tests
  it('should throw a 400 error for invalid metric file (no issues)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile(),
        metricFile: metricFile('issues'),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'No issues found in metric file.' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 400 error for invalid metric file (no type)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile(),
        metricFile: metricFile('type'),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error reading metric file: issue must have a type attribute' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 400 error for invalid metric file (no display)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile(),
        metricFile: metricFile('display'),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error reading metric file: issue must have a display attribute' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 400 error for invalid metric file (too deep)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile(),
        metricFile: metricFile('level'),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error reading metric file: issues can not be more than three levels deep' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 400 error for invalid metric file (empty)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile(),
        metricFile: metricFile('empty'),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'No issues found in metric file.' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 400 error for invalid metric file (empty)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile(),
        metricFile: metricFile('empty'),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'No issues found in metric file.' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Bitext file tests
  it('should throw a 400 error for invalid metric file (error on line)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile('line'),
        metricFile: metricFile(),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error reading bitext file in line 3' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 400 error for invalid metric file (insufficient columns)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile('column'),
        metricFile: metricFile(),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error reading bitext file: File must have two or more columns' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 400 error for invalid metric file (empty)', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }) });
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
      files: {
        bitextFile: bitextFile('empty'),
        metricFile: metricFile(),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error reading bitext file: File is blank' });

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should successfully create a new project and return a successful response', async () => {
    const mockedUserService = userService();
    const mockedRoleService = roleService();
    const issues = {
      typography: {
        parent: 'fluency',
      },
      punctuation: {
        parent: 'typography',
      },
      terminology: {
        parent: null,
      },
      termbase: {
        parent: 'terminology',
      },
      'terminology-company': {
        parent: 'termbase',
      },
      'terminology-third-party': {
        parent: 'termbase',
      },
      'term-inconsistency': {
        parent: 'terminology',
      },
      'multiple-terms-for-concept': {
        parent: 'term-inconsistency',
      },
      'multiple-translations-of-term': {
        parent: 'term-inconsistency',
      },
      'unpaired-marks': {
        parent: 'typography',
      },
      whitespace: {
        parent: 'typography',
      },
      orthography: {
        parent: 'fluency',
      },
      spelling: {
        parent: 'orthography',
      },
      'wrong-term': {
        parent: 'terminology',
      },
      accuracy: {
        parent: null,
      },
      mistranslation: {
        parent: 'accuracy',
      },
      'technical-relationship': {
        parent: 'mistranslation',
      },
      'ambiguous-translation': {
        parent: 'mistranslation',
      },
      'false-friend': {
        parent: 'mistranslation',
      },
      'unit-conversion': {
        parent: 'mistranslation',
      },
      number: {
        parent: 'mistranslation',
      },
      'date-time': {
        parent: 'mistranslation',
      },
      entity: {
        parent: 'mistranslation',
      },
      'overly-literal': {
        parent: 'mistranslation',
      },
      'over-translation': {
        parent: 'accuracy',
      },
      'under-translation': {
        parent: 'accuracy',
      },
      addition: {
        parent: 'accuracy',
      },
      omission: {
        parent: 'accuracy',
      },
      'omitted-variable': {
        parent: 'omission',
      },
      'no-translate': {
        parent: 'accuracy',
      },
      untranslated: {
        parent: 'accuracy',
      },
      'untranslated-graphic': {
        parent: 'untranslated',
      },
      fluency: {
        parent: null,
      },
      grammar: {
        parent: 'fluency',
      },
      'word-form': {
        parent: 'grammar',
      },
      'part-of-speech': {
        parent: 'word-form',
      },
      'tense-mood-aspect': {
        parent: 'word-form',
      },
      agreement: {
        parent: 'word-form',
      },
      'word-order': {
        parent: 'grammar',
      },
      'function-words': {
        parent: 'grammar',
      },
      diacritics: {
        parent: 'orthography',
      },
      transliteration: {
        parent: 'orthography',
      },
      capitalization: {
        parent: 'orthography',
      },
      compounding: {
        parent: 'orthography',
      },
      'title-style': {
        parent: 'orthography',
      },
      'corpus-conformance': {
        parent: 'fluency',
      },
      'pattern-problem': {
        parent: 'fluency',
      },
      duplication: {
        parent: 'fluency',
      },
    };
    const mockedProjectService = projectService({ createProject: () => ({ rows: [{ project_id: 1 }] }) });
    const mockedIssueService = issueService({ getAllIssues: () => ({ rows: ['test'] }), getIssueById: (issue) => ({ rows: [issues[issue]] }) });
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
      files: {
        bitextFile: bitextFile(),
        metricFile: metricFile(),
        specificationsFile: specificationsFile(),
      },
      role: 'superadmin',
    });

    const res = response();
    jest.spyOn(projectController, 'upsertProject');
    jest.spyOn(res, 'json');
    await projectController.createProject(req, res);

    expect(projectController.upsertProject).toHaveBeenCalledTimes(1);
    const mockUpsertProjectCall = projectController.upsertProject.mock.calls[0];
    expect(mockUpsertProjectCall[0]).toStrictEqual(req);
    expect(mockUpsertProjectCall[1]).toStrictEqual(res);
    expect(mockUpsertProjectCall[2]).toBeUndefined();

    expect(pgClient.query).toHaveBeenCalledTimes(2);
    const mockFirstQueryCall = pgClient.query.mock.calls[0];
    const mockSecondQueryCall = pgClient.query.mock.calls[1];
    expect(mockFirstQueryCall[0]).toBe('BEGIN');
    expect(mockSecondQueryCall[0]).toBe('COMMIT');

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Project created successfully.' });
  });
});
