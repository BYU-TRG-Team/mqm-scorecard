const { Pool } = require('pg');
const { connectionString } = require('../config/db.config');

const db = new Pool({
  connectionString,
  ssl: process.env.APP_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = db;
