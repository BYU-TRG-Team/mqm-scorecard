const parseXML = require('xml2js').parseStringPromise;
const xmlBuilder = require('xmlbuilder');
const errorMessages = require('../messages/errors.messages');

class IssueController {
  constructor(issueService, projectService, db, fileParser, issueParser, logger) {
    this.issueService = issueService;
    this.projectService = projectService;
    this.db = db;
    this.fileParser = fileParser;
    this.issueParser = issueParser;
    this.logger = logger;
  }

  /*
  * POST /api/issues
  * @typologyFile
  */
  async updateTypology(req, res) {
    const client = await this.db.connect();
    let typologyFile;
    const newIssueTypes = [];

    if (req.files) {
      typologyFile = req.files.typologyFile;
    }

    if (typologyFile === undefined) {
      res.status(400).json({ message: 'Body must include a typology file' });
      return;
    }

    try {
      const projectResponse = await this.projectService.getAllProjects();

      if (projectResponse.rows.length !== 0) {
        res.status(400).json({ message: 'All projects must be deleted before importing a new typology' });
        return;
      }

      const parsedTypologyFile = await parseXML(typologyFile.data.toString())
        .catch((error) => {
          res.status(400).json({ message: `Problem parsing typology file: ${error}` });
        });

      if (res.headersSent) return;

      if (!parsedTypologyFile || !parsedTypologyFile.typology) {
        res.status(400).json({ message: 'Problem parsing typology file: No typology element found' });
        return;
      }

      const [typologyFileResponseErr, typologyFileResponse] = this.fileParser.parseTypologyFile(parsedTypologyFile.typology);

      if (typologyFileResponseErr) {
        res.status(400).json({ message: typologyFileResponseErr });
        return;
      }

      await client.query('BEGIN');
      await this.issueService.deleteIssues([], [], client);

      for (let i = 0; i < typologyFileResponse.length; ++i) {
        const selectedIssueType = typologyFileResponse[i];
        const {
          id, parent, name, description, notes, examples,
        } = selectedIssueType;

        newIssueTypes.push(name);
        await this.issueService.createIssue(id, parent, name, description, notes, examples, client);
      }

      await client.query('COMMIT');

      let message = 'The following issue types have been created: ';
      newIssueTypes.forEach((issueType, index) => {
        if (
          index > 0
        ) {
          message += `, ${issueType}`;
          return;
        }

        message += `${issueType}`;
      });

      res.json({ message });
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      await client.query('ROLLBACK');
      res.status(500).json({ message: errorMessages.generic });
    } finally {
      client.release();
    }
  }

  /*
  * GET /api/issues
  * @typologyFile
  */

  async getTypology(_req, res) {
    try {
      const issueResponse = await this.issueService.getAllIssues();
      const parsedIssues = this.issueParser.parseIssues(issueResponse.rows);
      const baseXml = xmlBuilder.create('typology');
      const recursiveIssueBuilder = ({
        issue, name, description, notes, examples, children,
      }, xml, level) => {
        const issueElement = xml.ele('errorType');
        issueElement.att('name', name);
        issueElement.att('id', issue);
        issueElement.att('level', level);
        issueElement.ele('description', {}, description);
        issueElement.ele('notes', {}, notes);
        issueElement.ele('examples', {}, examples);

        Object.keys(children).forEach((c) => recursiveIssueBuilder(children[c], issueElement, level + 1));
      };

      Object.keys(parsedIssues).forEach((ele) => recursiveIssueBuilder(parsedIssues[ele], baseXml, 0));

      res.set('Content-Type', 'text/xml');
      res.send(baseXml.end({ pretty: true }));
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: err,
      });
      res.status(500).json({ message: errorMessages.generic });
    }
  }
}

module.exports = IssueController;
