/* eslint-disable no-undef */
const SegmentController = require('../../segment.controller');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const segmentService = require('../../__mocks__/segmentService');
const projectService = require('../../__mocks__/projectService');
const issueService = require('../../__mocks__/issueService');

describe('tests createSegmentIssue method', () => {
  it('should throw a 400 error', async () => {
    const mockedSegmentService = segmentService();
    const mockedProjectService = projectService();
    const mockedIssueService = issueService();

    const segmentController = new SegmentController(
      mockedSegmentService,
      mockedProjectService,
      mockedIssueService,
    );

    const req = request({
      body: {
        note: 'test',
        highlighting: 'test',
        issue: 'test',
        level: 'test',
        type: 'test',
        highlightStartIndex: 'test',
      },
      params: {
        segmentId: 10,
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    await segmentController.createSegmentIssue(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 404 error', async () => {
    const mockedSegmentService = segmentService({ getSegmentById: jest.fn(() => ({ rows: [] })) });
    const mockedProjectService = projectService();
    const mockedIssueService = issueService();

    const segmentController = new SegmentController(
      mockedSegmentService,
      mockedProjectService,
      mockedIssueService,
    );

    const req = request({
      body: {
        note: 'test',
        highlighting: 'test',
        issue: 'test',
        level: 'test',
        type: 'test',
        highlightStartIndex: 'test',
        highlightEndIndex: 'test',
      },
      params: {
        segmentId: 10,
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    await segmentController.createSegmentIssue(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should throw a 403 error', async () => {
    const mockedSegmentService = segmentService({ getSegmentById: jest.fn(() => ({ rows: [{ project_id: 10 }] })) });
    const mockedProjectService = projectService({ getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 11 }] })) });
    const mockedIssueService = issueService();

    const segmentController = new SegmentController(
      mockedSegmentService,
      mockedProjectService,
      mockedIssueService,
    );

    const req = request({
      body: {
        note: 'test',
        highlighting: 'test',
        issue: 'test',
        level: 'test',
        type: 'test',
        highlightStartIndex: 'test',
        highlightEndIndex: 'test',
      },
      params: {
        segmentId: 10,
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    await segmentController.createSegmentIssue(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should call addSegmentIssue with segmentId, note, highlighting, issue, level, type, highlightStartIndex, highlightEndIndex', async () => {
    const mockedSegmentService = segmentService({ getSegmentById: jest.fn(() => ({ rows: [{ project_id: 10 }] })) });
    const mockedProjectService = projectService({ getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 10 }] })) });
    const mockedIssueService = issueService();

    const segmentController = new SegmentController(
      mockedSegmentService,
      mockedProjectService,
      mockedIssueService,
    );

    const req = request({
      body: {
        note: 'test note',
        highlighting: 'tes highlighting',
        issue: 'test issue',
        level: 'test level ',
        type: 'test type',
        highlightStartIndex: '0',
        highlightEndIndex: '10',
      },
      params: {
        segmentId: 10,
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    await segmentController.createSegmentIssue(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);

    expect(mockedIssueService.addSegmentIssue).toHaveBeenCalledTimes(1);
    expect(mockedIssueService.addSegmentIssue).toHaveBeenCalledWith(10, req.body.note, req.body.highlighting, req.body.issue, req.body.level, req.body.type, req.body.highlightStartIndex, req.body.highlightEndIndex);
  });
});
