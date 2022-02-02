/* eslint-disable class-methods-use-this */
class SegmentService {
  constructor(db) {
    this.db = db;
  }

  createSegments(segments, projectId, client = this.db) {
    const values = [];
    let paramNum = 1;
    let initialized = false;
    let query = `
      INSERT 
      INTO SEGMENTS(project_id, segment_data, segment_num)
      VALUES 
    `;

    segments.forEach((segment, i) => {
      if (initialized) {
        query += ', ';
      } else {
        initialized = true;
      }

      values.push(projectId, segment, i + 1);
      query += `($${paramNum}, $${paramNum + 1}, $${paramNum + 2})`;
      paramNum += 3;
    });

    return client.query(query, values);
  }

  deleteSegments(attributes, values, client = this.db) {
    let filters = '';

    for (let i = 0; i < attributes.length; ++i) {
      if (i > 0) {
        filters += `AND ${attributes[i]}=$${i + 1}`;
        continue;
      }

      filters += `WHERE ${attributes[i]}=$${i + 1}`;
    }

    const query = `
      DELETE FROM segments ${filters};
    `;

    return client.query(query, values);
  }

  getSegmentsByProjectId(projectId) {
    const query = `
      SELECT segment_data, segment_num, id FROM segments WHERE project_id=$1 ORDER BY segment_num ASC;
    `;

    return this.db.query(query, [projectId]);
  }

  getSegmentById(segmentId) {
    const query = `
      SELECT * from segments WHERE id=$1
    `;

    return this.db.query(query, [segmentId]);
  }

  getSegmentByIssueId(errorId) {
    const query = `
      SELECT segments.project_id as project_id from segments join segment_issues ON segments.id = segment_issues.segment_id WHERE segment_issues.id=$1
    `;

    return this.db.query(query, [errorId]);
  }

  setSegmentAttributes(attributes, values, segmentId) {
    let filters = '';
    const numParams = attributes.length;

    for (let i = 0; i < attributes.length; ++i) {
      if (i > 0) {
        filters += ', ';
      }

      filters += `${attributes[i]} = $${i + 1}`;
    }

    const query = `
      UPDATE segments SET ${filters}
      WHERE id=$${numParams + 1} RETURNING *;
    `;

    values.push(segmentId);
    return this.db.query(query, values);
  }
}

module.exports = SegmentService;
