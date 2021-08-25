/* eslint-disable class-methods-use-this */
class IssueService {
  constructor(db) {
    this.db = db;
  }

  getIssueById(id, client) {
    const getIssueQuery = `
      SELECT 
      *
      FROM issues
      WHERE id=$1;
  `;

    return client.query(getIssueQuery, [id]);
  }

  createIssue(id, parent, name, description, notes, examples, client) {
    const query = `
      INSERT 
      INTO issues(id, parent, name, description, notes, examples)
      VALUES
      ($1, $2, $3, $4, $5, $6)
    `;

    return client.query(query, [id, parent, name, description, notes, examples]);
  }

  createProjectIssue(projectId, issue, display, client) {
    const createProjectIssueQuery = `
      INSERT
      INTO project_issues(project_id, issue, display)
      VALUES
      ($1, $2, $3)
    `;

    return client.query(createProjectIssueQuery, [projectId, issue, display]);
  }

  getProjectIssuesById(projectId) {
    const query = `
      SELECT 
      issues.id as issue, 
      issues.parent as parent, 
      issues.name as name, 
      issues.description as description, 
      issues.notes as notes, 
      issues.examples as examples 
      FROM issues JOIN project_issues ON issues.id = project_issues.issue 
      WHERE project_issues.project_id=$1;
    `;

    return this.db.query(query, [projectId]);
  }

  deleteIssues(attributes, values, client) {
    let filters = '';

    for (let i = 0; i < attributes.length; ++i) {
      if (i > 0) {
        filters += `AND ${attributes[i]}=$${i + 1}`;
        continue;
      }

      filters += `WHERE ${attributes[i]}=$${i + 1}`;
    }

    const query = `
      DELETE FROM issues ${filters};
    `;

    return client.query(query, values);
  }

  getAllIssues() {
    const query = `
      SELECT * FROM issues;
    `;

    return this.db.query(query);
  }

  addSegmentError(segmentId, note, highlighting, issue, level, type, highlightStartindex, highlightEndIndex) {
    const query = `
      INSERT 
      INTO segment_issues(segment_id, note, highlighting, issue, level, type, highlight_start_index, highlight_end_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING;
    `;

    return this.db.query(query, [segmentId, note, highlighting, issue, level, type, highlightStartindex, highlightEndIndex]);
  }

  getSegmentErrorsBySegmentId(segmentId) {
    const query = `
      SELECT 
      segment_issues.id as id, 
      segment_issues.segment_id as segment_id, 
      segment_issues.issue as issue,
      segment_issues.level as level,
      segment_issues.type as type,
      segment_issues.highlighting as highlighting,
      segment_issues.note as note,
      issues.name as issue_name
      FROM segment_issues JOIN issues ON segment_issues.issue = issues.id
      WHERE segment_id=$1
    `;

    return this.db.query(query, [segmentId]);
  }

  getSegmentErrorsByProjectId(projectId) {
    const query = `
      SELECT 
      table1.id as id, 
      table1.segment_id as segment_id, 
      table1.issue as issue, 
      table1.level as level,
      table1.type as type,
      table1.highlighting as highlighting,
      table1.note as note,
      table1.highlight_start_index as highlight_start_index,
      table1.highlight_end_index as highlight_end_index,
      issues.name as issue_name
      FROM 
        issues JOIN
        (SELECT 
          segment_issues.id as id, 
          segment_issues.segment_id as segment_id, 
          segment_issues.issue as issue, 
          segment_issues.level as level,
          segment_issues.type as type,
          segment_issues.highlighting as highlighting,
          segment_issues.note as note,
          segment_issues.highlight_start_index as highlight_start_index,
          segment_issues.highlight_end_index as highlight_end_index,
          segments.project_id as project_id
          FROM segment_issues JOIN segments ON segment_issues.segment_id=segments.id) table1
        ON
        issues.id = table1.issue
        WHERE table1.project_id=$1  
        ORDER BY id ASC;
    `;

    return this.db.query(query, [projectId]);
  }

  deleteSegmentErrorById(errorId) {
    const query = `
      DELETE FROM segment_issues WHERE id=$1;
    `;

    return this.db.query(query, [errorId]);
  }

  getProjectReportById(projectId) {
    const query = `
      SELECT 
      table2.issue as issue, 
      json_agg(table2.type) as type, 
      json_agg(table2.level) as level 
      FROM (
        SELECT 
        issues.id as issue, 
        table1.level, 
        table1.type FROM issues LEFT JOIN (
          SELECT 
          segment_issues.level as level, 
          segment_issues.type as type, 
          segment_issues.issue as issue 
          FROM segment_issues join segments ON segment_issues.segment_id = segments.id WHERE segments.project_id=$1
        ) as table1 
        ON issues.id = table1.issue
      ) table2 
      GROUP BY table2.issue;
    `;

    return this.db.query(query, [projectId]);
  }
}

module.exports = IssueService;
