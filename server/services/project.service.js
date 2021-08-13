/* eslint-disable class-methods-use-this */
class ProjectService {
  constructor(db) {
    this.db = db;
  }

  createProject(projectName, specificationsFileName, specifications, metricFileName, bitextFileName, sourceWordCount, targetWordCount, client) {
    const createProjectQuery = `
      INSERT
      INTO projects(name, specifications_file, specifications, metric_file, bitext_file, source_word_count, target_word_count)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
      project_id;
    `;

    return client.query(createProjectQuery, [projectName, specificationsFileName, specifications, metricFileName, bitextFileName, sourceWordCount, targetWordCount]);
  }

  mapUsertoProject(projectId, userId, client) {
    const mapUserToProjectQuery = `
      INSERT
      INTO user_projects(project_id, user_id)
      VALUES
      ($1, $2);
    `;

    if (client) {
      return client.query(mapUserToProjectQuery, [projectId, userId]);
    }

    return this.db.query(mapUserToProjectQuery, [projectId, userId]);
  }

  getAllProjects() {
    const query = `
      SELECT * FROM projects ORDER BY project_id ASC;
    `;

    return this.db.query(query);
  }

  getProjectsByUserId(userId) {
    const query = `
      SELECT
      projects.project_id as project_id, 
      name, 
      specifications_file, 
      metric_file, 
      bitext_file, 
      specifications, 
      last_segment, 
      finished
      FROM projects join user_projects ON projects.project_id=user_projects.project_id
      WHERE user_projects.user_id=$1
    `;

    return this.db.query(query, [userId]);
  }

  deleteProjectById(projectId) {
    const query = `
      DELETE 
      FROM projects
      WHERE project_id=$1
    `;

    return this.db.query(query, [projectId]);
  }

  deleteUserFromAllProjects(userId) {
    const query = `
      DELETE 
      FROM user_projects 
      WHERE user_id=$1;
    `;

    return this.db.query(query, [userId]);
  }

  getProjectById(projectId) {
    const query = `
      SELECT
      * 
      FROM projects
      WHERE project_id=$1;
    `;

    return this.db.query(query, [projectId]);
  }

  getProjectUsersById(projectId) {
    const query = `
      SELECT
      users.username as username,
      users.user_id as user_id
      FROM 
      users JOIN user_projects ON users.user_id=user_projects.user_id
      WHERE user_projects.project_id=$1
    `;

    return this.db.query(query, [projectId]);
  }

  deleteUserFromProject(userId, projectId) {
    const query = `
      DELETE FROM
      user_projects
      WHERE user_id=$1 AND project_id=$2
    `;

    return this.db.query(query, [userId, projectId]);
  }

  setProjectAttributes(attributes, values, projectId) {
    let filters = '';
    const numParams = attributes.length;

    for (let i = 0; i < attributes.length; ++i) {
      if (i > 0) {
        filters += ', ';
      }

      filters += `${attributes[i]} = $${i + 1}`;
    }

    const query = `
      UPDATE projects SET ${filters}
      WHERE project_id=$${numParams + 1} RETURNING *;
    `;

    values.push(projectId);
    return this.db.query(query, values);
  }
}

module.exports = ProjectService;
