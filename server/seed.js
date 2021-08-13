require('dotenv').config({ path: `${__dirname}/../.env` });

console.log(`${__dirname}/../.env`);
const db = require('./db');

const dropUserTable = `
DROP TABLE IF EXISTS users CASCADE;
`;

const dropRolesTable = `
DROP TABLE IF EXISTS roles CASCADE;
`;

const dropTokensTable = `
DROP TABLE IF EXISTS tokens CASCADE;
`;

const dropIssuesTable = `
DROP TABLE IF EXISTS issues CASCADE;
`;

const dropProjectsTable = `
DROP TABLE IF EXISTS projects CASCADE;
`;

const dropProjectIssuesTable = `
DROP TABLE IF EXISTS project_issues CASCADE;
`;

const dropSegmentsTable = `
DROP TABLE IF EXISTS segments CASCADE;
`;

const dropUserProjectsTable = `
DROP TABLE IF EXISTS user_projects CASCADE;
`;

const dropNotesTable = `
DROP TABLE IF EXISTS notes CASCADE;
`;

const dropSegmentIssuesTable = `
DROP TABLE IF EXISTS segment_issues CASCADE;
`;

const createRolesTable = `
CREATE TABLE IF NOT EXISTS roles(
role_id serial PRIMARY KEY,
role_name text UNIQUE NOT NULL
);
`;

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users(
user_id serial PRIMARY KEY,
username text UNIQUE NOT NULL,
verified boolean DEFAULT FALSE,
password text NOT NULL,
email text UNIQUE NOT NULL,
name text NOT NULL,
role_id integer NOT NULL,
reset_password_token text,
reset_password_token_created_at timestamp WITH TIME ZONE,
FOREIGN KEY (role_id)
REFERENCES roles (role_id)
);
`;

const createTokensTable = `
CREATE TABLE IF NOT EXISTS tokens(
user_id integer NOT NULL,
token text PRIMARY KEY,
FOREIGN KEY (user_id)
REFERENCES users (user_id) ON DELETE CASCADE
);
`;

const createProjectsTable = `
CREATE TABLE IF NOT EXISTS projects(
project_id serial PRIMARY KEY,
name text NOT NULL,
specifications_file text DEFAULT NULL,
metric_file text NOT NULL,
bitext_file text NOT NULL,
specifications text DEFAULT NULL,
last_segment integer NOT NULL DEFAULT 1,
finished boolean NOT NULL DEFAULT FALSE,
source_word_count integer NOT NULL DEFAULT 0,
target_word_count integer NOT NULL DEFAULT 0
);
`;

const createIssuesTable = `
CREATE TABLE IF NOT EXISTS issues(
id text PRIMARY KEY,
parent text DEFAULT NULL, 
name text NOT NULL,
description text DEFAULT NULL,
notes text DEFAULT NULL,
examples text DEFAULT NULL
);
`;

const createUsersProjects = `
CREATE TABLE IF NOT EXISTS user_projects(
project_id integer NOT NULL,
user_id integer NOT NULL,
FOREIGN KEY (user_id)
REFERENCES users (user_id) ON DELETE CASCADE,
FOREIGN KEY (project_id)
REFERENCES projects (project_id) ON DELETE CASCADE,
UNIQUE (project_id, user_id)
);
`;

const createProjectIssuesTable = `
CREATE TABLE IF NOT EXISTS project_issues(
id serial PRIMARY KEY,
project_id integer NOT NULL,
issue text NOT NULL,
display boolean NOT NULL,
FOREIGN KEY (project_id)
REFERENCES projects (project_id) ON DELETE CASCADE,
FOREIGN KEY (issue)
REFERENCES issues (id) ON DELETE CASCADE
);
`;

const createSegmentsTable = `
CREATE TABLE IF NOT EXISTS segments(
id serial PRIMARY KEY,
project_id integer NOT NULL,
segment_data jsonb NOT NULL,
segment_num integer NOT NULL,
FOREIGN KEY (project_id)
REFERENCES projects (project_id) ON DELETE CASCADE,
UNIQUE(project_id, segment_num)
);
`;

const createNotesTable = `
CREATE TABLE IF NOT EXISTS notes(
id serial PRIMARY KEY,
context text NOT NULL,
segment_id integer NOT NULL,
FOREIGN KEY (segment_id)
REFERENCES segments (id) ON DELETE CASCADE
);
`;

const createSegmentIssuesTable = `
CREATE TABLE IF NOT EXISTS segment_issues(
id serial PRIMARY KEY,
segment_id integer NOT NULL,
issue text NOT NULL,
level text NOT NULL,
type text NOT NULL,
highlighting text NOT NULL,
note text NOT NULL,
highlight_start_index integer NOT NULL,
highlight_end_index integer NOT NULL,
FOREIGN KEY (segment_id)
REFERENCES segments (id) ON DELETE CASCADE,
FOREIGN KEY (issue)
REFERENCES issues (id) ON DELETE CASCADE
);
`;

const seedRoles = `
INSERT INTO roles (role_name) VALUES
('user'),
('admin'),
('superadmin');
`;

(async function seedDatabase() {
  await db.query(dropTokensTable);
  await db.query(dropUserTable);
  await db.query(dropRolesTable);
  await db.query(dropIssuesTable);
  await db.query(dropProjectsTable);
  await db.query(dropProjectIssuesTable);
  await db.query(dropUserProjectsTable);
  await db.query(dropSegmentsTable);
  await db.query(dropNotesTable);
  await db.query(dropSegmentIssuesTable);
  await db.query(createRolesTable);
  await db.query(createUsersTable);
  await db.query(createTokensTable);
  await db.query(createProjectsTable);
  await db.query(createIssuesTable);
  await db.query(createProjectIssuesTable);
  await db.query(createSegmentsTable);
  await db.query(createUsersProjects);
  await db.query(createNotesTable);
  await db.query(createSegmentIssuesTable);
  await db.query(seedRoles);

  console.log('Successfully seeded database');
}());
