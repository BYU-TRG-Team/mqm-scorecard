const parseXML = require('xml2js').parseStringPromise;
const errorMessages = require('../messages/errors.messages');

class ProjectController {
  constructor(db, userService, roleService, fileParser, projectService, issueService, segmentService, issueParser) {
    this.userService = userService;
    this.roleService = roleService;
    this.db = db;
    this.fileParser = fileParser;
    this.projectService = projectService;
    this.issueService = issueService;
    this.segmentService = segmentService;
    this.issueParser = issueParser;
  }

  /*
  * POST /api/project
  * @bitextFile
  * @metricFile
  * @specificationsFile
  * @name
  */
  async createProject(req, res) {
    try {
      const { bitextFile, metricFile } = req.files;
      const { name } = req.body;

      if (bitextFile === undefined || metricFile === undefined || name === undefined) {
        res.status(400).json({ message: 'Insufficient files submitted: Request requires a project name, metric file, and bi-text file' });
        return;
      }

      await this.upsertProject(req, res);
    } catch (err) {
      res.status(500).json({ message: errorMessages.generic });
    }
  }

  /*
  * GET /api/projects
  */
  async getProjects(req, res) {
    try {
      let projectResponse;

      if (req.role === 'superadmin') {
        projectResponse = await this.projectService.getAllProjects();
      } else {
        projectResponse = await this.projectService.getProjectsByUserId(req.userId);
      }

      res.json({ projects: projectResponse.rows });
      return;
    } catch (err) {
      res.status(500).json({ message: errorMessages.generic });
    }
  }

  /*
  * DELETE /api/project/:projectId
  */
  async deleteProject(req, res) {
    try {
      if (await this.isUserAssignedToProject(req, req.params.projectId)) {
        await this.projectService.deleteProjectById(req.params.projectId);
        res.status(204).send();
        return;
      }

      res.status(403).json({ message: errorMessages.accessForbidden });
    } catch (err) {
      res.status(500).json({ message: errorMessages.generic });
    }
  }

  /*
  * GET /api/project/:projectId
  */
  async getProject(req, res) {
    try {
      if (await this.isUserAssignedToProject(req, req.params.projectId)) {
        try {
          const projectResponse = await this.projectService.getProjectById(req.params.projectId);
          const project = projectResponse.rows[0];
          const projectUserResponse = await this.projectService.getProjectUsersById(project.project_id);
          const projectSegmentsResponse = await this.segmentService.getSegmentsByProjectId(project.project_id);
          const issueResponse = await this.issueService.getProjectIssuesById(project.project_id);
          const report = await this.createReport(project.project_id);

          // Organize segment errors by source and target
          for (let i = 0; i < projectSegmentsResponse.rows.length; ++i) {
            const { id } = projectSegmentsResponse.rows[i];
            const segmentErrors = await this.issueService.getSegmentErrorsBySegmentId(id);
            const sourceErrors = segmentErrors.rows.filter((segmentError) => segmentError.type === 'source');
            const targetErrors = segmentErrors.rows.filter((segmentError) => segmentError.type === 'target');
            projectSegmentsResponse.rows[i].sourceErrors = sourceErrors;
            projectSegmentsResponse.rows[i].targetErrors = targetErrors;
          }

          res.json({
            project,
            report,
            users: projectUserResponse.rows,
            segments: projectSegmentsResponse.rows,
            issues: this.issueParser.parseIssues(issueResponse.rows),
            score: await this.generateProjectScore(req.params.projectId),
          });
          return;
        } catch (err) {
          res.status(500).json({ message: errorMessages.generic });
        }
      }

      res.status(403).json({ message: errorMessages.accessForbidden });
    } catch (err) {
      res.status(500).json({ message: errorMessages.generic });
    }
  }

  /*
  * GET /api/project/:projectId/report
  */
  async getProjectReport(req, res) {
    if (await this.isUserAssignedToProject(req, req.params.projectId)) {
      const projectResponse = await this.projectService.getProjectById(req.params.projectId);
      const projectSegmentsResponse = await this.segmentService.getSegmentsByProjectId(req.params.projectId);
      const projectSegmentErrorsResponse = await this.issueService.getSegmentErrorsByProjectId(req.params.projectId);
      const compositeScore = await this.generateProjectScore(req.params.projectId);
      const { name } = projectResponse.rows[0];
      const key = {};

      projectSegmentsResponse.rows.forEach((seg) => {
        key[seg.id] = String(seg.segment_num);
      });

      res.json({
        projectName: name,
        key,
        errors: projectSegmentErrorsResponse.rows.map((segmentError) => (
          {
            segment: String(segmentError.segment_id),
            target: segmentError.type,
            name: segmentError.issue_name,
            severity: segmentError.level,
            issueReportId: String(segmentError.id),
            issueId: segmentError.issue,
            note: segmentError.note,
            highlighting: {
              startIndex: segmentError.highlight_start_index,
              endIndex: segmentError.highlight_end_index,
            },
          }
        )),
        scores: {
          compositeScore,
        },
        segments: {
          source: projectSegmentsResponse.rows.map((seg) => seg.segment_data.Source),
          target: projectSegmentsResponse.rows.map((seg) => seg.segment_data.Target),
        },
      });

      return;
    }

    res.status(403).json({ message: errorMessages.accessForbidden });
  }

  /*
  * DELETE /api/project/:projectId/user/:userId
  */

  async deleteUserFromProject(req, res) {
    try {
      if (await this.isUserAssignedToProject(req, req.params.projectId)) {
        const { projectId, userId } = req.params;

        await this.projectService.deleteUserFromProject(userId, projectId);
        return res.status(204).send();
      }

      return res.status(403).json({ message: errorMessages.accessForbidden });
    } catch (err) {
      return res.status(500).json({ message: errorMessages.generic });
    }
  }

  /*
  * DELETE /api/user/:userId/projects
  */
  async deleteUserFromAllProjects(req, res) {
    try {
      const { userId } = req.params;

      await this.projectService.deleteUserFromAllProjects(userId);
      res.status(204).send();
      return;
    } catch (err) {
      res.status(500).json({ message: errorMessages.generic });
    }
  }

  /*
  * POST /api/project/:projectId/user
  * @username
  */
  async addUserToProject(req, res) {
    try {
      const { username } = req.body;
      const { projectId } = req.params;

      if (username === undefined) {
        res.status(400).json({ message: 'Body must include a username' });
        return;
      }

      if (await this.isUserAssignedToProject(req, projectId)) {
        const userResponse = await this.userService.findUsers(['username'], [username]);
        const user = userResponse.rows[0];

        if (!user) {
          res.status(404).json({ message: `No user found with the username "${username}"` });
          return;
        }

        await this.projectService.mapUsertoProject(projectId, user.user_id)
          .catch((err) => {
            if (err.code === '23505') {
              return res.status(409).json({ message: `${username} has already been assigned to this project` });
            }
            return res.status(500).json({ message: errorMessages.generic });
          });

        if (res.headersSent) return;

        res.status(204).send();
        return;
      }

      res.status(403).json({ message: errorMessages.accessForbidden });
      return;
    } catch (err) {
      res.status(500).json({ message: errorMessages.generic });
    }
  }

  /*
  * PUT /api/project/:projectId
  * @bitextFile
  * @metricFile
  * @specificationsFile
  * @name
  * @finished
  * @segmentNum
  */
  async updateProject(req, res) {
    try {
      if (await this.isUserAssignedToProject(req, req.params.projectId)) {
        return this.upsertProject(req, res, true);
      }

      return res.status(403).json({ message: errorMessages.accessForbidden });
    } catch (err) {
      return res.status(500).json({ message: errorMessages.generic });
    }
  }

  async upsertProject(req, res, isUpdate = false) {
    const client = await this.db.connect();
    const { name, finished, segmentNum } = req.body;
    const newProjectAttributes = [];
    const newProjectValues = [];

    let bitextFile;
    let metricFile;
    let specificationsFile;
    let specifications = '';
    let metric = [];
    let segments = [];
    let sourceWordCount = 0;
    let targetWordCount = 0;
    let projectId;
    let transactionInProgress = false;
    const isAdmin = req.role === 'superadmin' || req.role === 'admin';

    if (req.params && req.params.projectId) {
      projectId = req.params.projectId;
    }

    if (req.files) {
      bitextFile = req.files.bitextFile;
      metricFile = req.files.metricFile;
      specificationsFile = req.files.specificationsFile;
    }

    try {
      const hasSegmentErrors = projectId && await this.hasSegmentErrors(projectId);

      if (!await this.isTypologyImported()) {
        res.status(400).json({ message: 'Typology not yet imported. Please contact an administrator for help.' });
        return;
      }

      if ((metricFile !== undefined || bitextFile !== undefined) && hasSegmentErrors) {
        res.status(400).json({ message: 'Changing the bi-text or metric files is not possible until all reported issues are removed.' });
        return;
      }

      if (name !== undefined && isAdmin) {
        newProjectAttributes.push('name');
        newProjectValues.push(name);
      }

      if (finished !== undefined) {
        newProjectAttributes.push('finished');
        newProjectValues.push(finished);
      }

      if (segmentNum !== undefined) {
        newProjectAttributes.push('last_segment');
        newProjectValues.push(segmentNum);
      }

      if (metricFile !== undefined && isAdmin) {
        newProjectAttributes.push('metric_file');
        newProjectValues.push(metricFile.name);

        // Parse metric file
        const parsedMetricFile = await parseXML(metricFile.data.toString())
          .catch((error) => {
            res.status(400).json({ message: `Problem parsing metric file: ${error}` });
          });

        if (res.headersSent) return;

        if (!parsedMetricFile || !parsedMetricFile.issues || !parsedMetricFile.issues.issue) {
          res.status(400).json({ message: 'No issues found in metric file.' });
          return;
        }

        const [metricFileResponseErr, metricFileResponse] = this.fileParser.parseMetricFile(parsedMetricFile.issues, null);

        if (metricFileResponseErr) {
          res.status(400).json({ message: metricFileResponseErr });
          return;
        }

        metric = metricFileResponse;
      }

      if (bitextFile !== undefined && isAdmin) {
        // Parse Bi-text file
        const [bitextFileResponseErr, bitextFileResponse] = this.fileParser.parseBiColumnBitext(bitextFile.data.toString());

        if (bitextFileResponseErr) {
          res.status(400).json({ message: bitextFileResponseErr });
          return;
        }

        segments = bitextFileResponse.segments;
        sourceWordCount = bitextFileResponse.sourceWordCount;
        targetWordCount = bitextFileResponse.targetWordCount;

        newProjectAttributes.push('bitext_file');
        newProjectValues.push(bitextFile.name);
        newProjectAttributes.push('last_segment');
        newProjectValues.push(1);
        newProjectAttributes.push('source_word_count');
        newProjectValues.push(sourceWordCount);
        newProjectAttributes.push('target_word_count');
        newProjectValues.push(targetWordCount);
      }

      if (specificationsFile !== undefined && isAdmin) {
        // Parse specifications file
        const parsedSpecificationsFile = await parseXML(specificationsFile.data.toString())
          .catch((error) => {
            res.status(400).json({ message: `Problem parsing specifications file: ${error}` });
          });

        if (res.headersSent) return;

        const [specificationsFileResponseErr, specificationsFileResponse] = this.fileParser.parseSpecificationsFile(parsedSpecificationsFile);

        if (specificationsFileResponseErr) {
          res.status(400).json({ message: specificationsFileResponseErr });
          return;
        }

        specifications = specificationsFileResponse;
        newProjectAttributes.push('specifications_file');
        newProjectValues.push(specificationsFile.name);
        newProjectAttributes.push('specifications');
        newProjectValues.push(specifications);
      }

      await client.query('BEGIN');
      transactionInProgress = true;

      if (!isUpdate) {
        const newProject = await this.projectService.createProject(name, specificationsFile ? specificationsFile.name : '', specifications, metricFile.name, bitextFile.name, sourceWordCount, targetWordCount, client);

        // eslint-disable-next-line prefer-destructuring
        projectId = newProject.rows[0].project_id;
        await this.projectService.mapUsertoProject(projectId, req.userId, client);
      }

      if (metricFile !== undefined && isAdmin) {
        // Save issues from metric file
        for (let i = 0; i < metric.length; ++i) {
          const selectedIssue = metric[i];

          const issueResponse = await this.issueService.getIssueById(selectedIssue.issue, client);

          if (issueResponse.rows.length === 0) {
            res.status(400).json({ message: `Error type "${selectedIssue.issue}" does not exist in the typology` });
            return;
          }

          if (issueResponse.rows[0].parent !== selectedIssue.parent) {
            res.status(400).json({ message: `Error type "${selectedIssue.issue}" does not have the parent error type "${selectedIssue.parent}"` });
            return;
          }

          await this.issueService.createProjectIssue(projectId, selectedIssue.issue, selectedIssue.display, client);
        }
      }

      if (bitextFile !== undefined && isAdmin) {
        if (isUpdate) {
          await this.segmentService.deleteSegments(['project_id'], [projectId], client);
        }
        await this.segmentService.createSegments(segments, projectId, client);
      }

      if (isUpdate) {
        await this.projectService.setProjectAttributes(newProjectAttributes, newProjectValues, projectId);
      }

      await client.query('COMMIT');
      transactionInProgress = false;

      const message = isUpdate ? 'Project updated successfully.' : 'Project created successfully.';
      res.json({ message });
    } catch (err) {
      res.status(500).json({ message: errorMessages.generic });
    } finally {
      if (transactionInProgress) {
        await client.query('ROLLBACK');
      }
      client.release();
    }
  }

  async isUserAssignedToProject(req, projectId) {
    const userProjectsResponse = await this.projectService.getProjectsByUserId(req.userId);
    return (
      (userProjectsResponse.rows.filter((proj) => Number(proj.project_id) === Number(projectId)).length > 0)
      || req.role === 'superadmin'
    );
  }

  async isTypologyImported() {
    const issueResponse = await this.issueService.getAllIssues();
    return issueResponse.rows.length > 0;
  }

  async hasSegmentErrors(projectId) {
    const projectSegmentsResponse = await this.segmentService.getSegmentsByProjectId(projectId);
    let hasSegmentErrors = false;

    for (let i = 0; i < projectSegmentsResponse.rows.length; ++i) {
      const { id } = projectSegmentsResponse.rows[i];
      const segmentErrors = await this.issueService.getSegmentErrorsBySegmentId(id);

      if (segmentErrors.rows.length > 0) {
        hasSegmentErrors = true;
        break;
      }
    }

    return hasSegmentErrors;
  }

  async createReport(projectId) {
    const reportResponse = await this.issueService.getProjectReportById(projectId);
    const report = {};

    reportResponse.rows.forEach((issue) => {
      const sourceMinor = issue.level.filter((level, index) => level === 'minor' && issue.type[index] === 'source').length;
      const sourceMajor = issue.level.filter((level, index) => level === 'major' && issue.type[index] === 'source').length;
      const sourceCritical = issue.level.filter((level, index) => level === 'critical' && issue.type[index] === 'source').length;

      const targetMinor = issue.level.filter((level, index) => level === 'minor' && issue.type[index] === 'target').length;
      const targetMajor = issue.level.filter((level, index) => level === 'major' && issue.type[index] === 'target').length;
      const targetCritical = issue.level.filter((level, index) => level === 'critical' && issue.type[index] === 'target').length;

      report[issue.issue] = [
        // Source errors
        sourceMinor,
        sourceMajor,
        sourceCritical,
        sourceMinor + sourceMajor + sourceCritical,
        // Target errors
        targetMinor,
        targetMajor,
        targetCritical,
        targetMinor + targetMajor + targetCritical,
        sourceMinor + sourceMajor + sourceCritical + targetMinor + targetMajor + targetCritical,
      ];
    });

    return report;
  }

  async generateProjectScore(projectId) {
    const reportResponse = await this.issueService.getProjectReportById(projectId);
    const projectResponse = await this.projectService.getProjectById(projectId);
    let sourceWordCount = 0;
    let targetWordCount = 0;
    let APT = 0;

    if (projectResponse.rows.length > 0) {
      sourceWordCount = projectResponse.rows[0].source_word_count;
      targetWordCount = projectResponse.rows[0].target_word_count;
    }

    const SEVERITY_WEIGHTS = {
      minor: 1,
      major: 5,
      critical: 25,
    };

    reportResponse.rows.forEach((issue) => {
      issue.level.forEach((level) => {
        if (level !== null) {
          APT += SEVERITY_WEIGHTS[level];
        }
      });
    });

    const ONPT = (APT * sourceWordCount) / targetWordCount;
    const OQF = 1 - (ONPT / sourceWordCount);

    const MSV = 100;
    const finalScore = (OQF * MSV).toFixed(2);

    return finalScore;
  }
}

module.exports = ProjectController;
