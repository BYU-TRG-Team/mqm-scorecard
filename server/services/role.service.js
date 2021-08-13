class RoleService {
  constructor(db) {
    this.db = db;
  }

  findRole(roleId) {
    const query = `
      SELECT * FROM roles WHERE role_id=$1;
    `;

    return this.db.query(query, [roleId]);
  }
}

module.exports = RoleService;
