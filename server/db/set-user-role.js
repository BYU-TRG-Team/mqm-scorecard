require('dotenv').config();

const db = require(".");;
const roles = require("../roles");
const updateUserRoleQuery = "UPDATE users SET role_id=$1 WHERE username=$2";
const usage = `Usage: npm run db:set-user-role <username> <role id>
Valid role id: 1 (user) | 2 (admin) | 3 (superadmin)`
const username = process.argv[2]
const roleId = process.argv[3]

if (process.env.DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL environment variable is unset")
}

if (process.argv.length !== 4) {
  throw new Error(usage)
}

if (roles[roleId] === undefined) {
  throw new Error(usage)
}

(async function seedDatabase() {
  await db.query(updateUserRoleQuery, [roleId, username])
  await db.end();
  console.log(`Successfully updated user "${username}" to ${roles[roleId]}.`);
}());



