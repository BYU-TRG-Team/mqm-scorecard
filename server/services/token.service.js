class TokenService {
  constructor(db) {
    this.db = db;
  }

  create(userId, token, client = this.db) {
    const query = `
      INSERT INTO tokens (user_id, token) VALUES
      ($1, $2) RETURNING *;
    `;

    return client.query(query, [userId, token]);
  }

  deleteToken(token) {
    const query = `
      DELETE FROM tokens WHERE token=$1 RETURNING *;
    `;

    return this.db.query(query, [token]);
  }

  findTokens(attributes, values) {
    let filters = '';

    for (let i = 0; i < attributes.length; ++i) {
      if (i > 0) {
        filters += `AND ${attributes[i]}=$${i + 1}`;
        continue;
      }

      filters += `${attributes[i]}=$${i + 1}`;
    }

    const query = `
      SELECT * FROM tokens WHERE ${filters};
    `;

    return this.db.query(query, values);
  }
}

module.exports = TokenService;
