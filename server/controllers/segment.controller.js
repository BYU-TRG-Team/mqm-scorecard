const errorMessages = require('../messages/errors.messages');

class SegmentController {
  constructor(segmentService, projectService, issueService, logger) {
    this.segmentService = segmentService;
    this.projectService = projectService;
    this.issueService = issueService;
    this.logger = logger;
  }

  /*
  * POST /api/segment/:segmentId/error
  * @note
  * @highlighting
  * @issue
  * @level
  * @type
  * @highlightStartIndex
  * @highlightEndIndex
  */
  async createSegmentIssue(req, res) {
    try {
      const {
        note, highlighting, issue, level, type, highlightStartIndex, highlightEndIndex,
      } = req.body;

      if (note === undefined || highlighting === undefined || issue === undefined || level === undefined || type === undefined || highlightStartIndex === undefined || highlightEndIndex === undefined) {
        res.status(400).send({ message: 'Body must include note, highlighting, issue, level, type, highlightStartIndex, and highlightEndIndex' });
        return;
      }

      const segmentResponse = await this.segmentService.getSegmentById(req.params.segmentId);
      const segment = segmentResponse.rows[0];

      if (segment === undefined) {
        res.status(404).send({ message: 'No segment found' });
        return;
      }

      if (await this.isUserAssignedToProject(req, segment.project_id)) {
        await this.issueService.addSegmentIssue(req.params.segmentId, note, highlighting, issue, level, type, highlightStartIndex, highlightEndIndex);
        res.status(204).send();
        return;
      }

      res.status(403).json({ message: errorMessages.accessForbidden });
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * DELETE /api/segment/error/:issueId
  */
  async deleteSegmentIssue(req, res) {
    try {
      const segmentResponse = await this.segmentService.getSegmentByIssueId(req.params.issueId);
      const segment = segmentResponse.rows[0];

      if (segment === undefined) {
        res.status(400).send({ message: 'No project found' });
        return;
      }

      if (await this.isUserAssignedToProject(req, segment.project_id)) {
        await this.issueService.deleteSegmentIssueById(req.params.issueId);
        res.status(204).send();
        return;
      }

      res.status(403).json({ message: errorMessages.accessForbidden });
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  async isUserAssignedToProject(req, projectId) {
    const userProjectsResponse = await this.projectService.getProjectsByUserId(req.userId);

    return (
      (userProjectsResponse.rows.filter((proj) => Number(proj.project_id) === Number(projectId)).length > 0)
      || req.role === 'superadmin'
    );
  }
}

module.exports = SegmentController;
