const errorMessages = require('../messages/errors.messages');

class SegmentController {
  constructor(segmentService, projectService, issueService) {
    this.segmentService = segmentService;
    this.projectService = projectService;
    this.issueService = issueService;
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
  async createSegmentError(req, res) {
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
        await this.issueService.addSegmentError(req.params.segmentId, note, highlighting, issue, level, type, highlightStartIndex, highlightEndIndex);
        res.status(204).send();
        return;
      }

      res.status(403).json({ message: errorMessages.accessForbidden });
    } catch (err) {
      res.status(500).send({ message: errorMessages.generic });
    }
  }

  /*
  * DELETE /api/segment/error/:errorId
  */
  async deleteSegmentError(req, res) {
    try {
      const segmentResponse = await this.segmentService.getSegmentByErrorId(req.params.errorId);
      const segment = segmentResponse.rows[0];

      if (segment === undefined) {
        res.status(400).send({ message: 'No project found' });
        return;
      }

      if (await this.isUserAssignedToProject(req, segment.project_id)) {
        await this.issueService.deleteSegmentErrorById(req.params.errorId);
        res.status(204).send();
        return;
      }

      res.status(403).json({ message: errorMessages.accessForbidden });
    } catch (err) {
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
