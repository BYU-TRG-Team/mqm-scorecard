import React from "react";
import { Link } from "react-router-dom";

const user = [
  <Link className="link secondary-sidebar__link" to="/view-projects">View projects</Link>,
  <Link className="link secondary-sidebar__link" to="/edit-profile">Edit profile</Link>,
  <Link className="link secondary-sidebar__link" to="/help">Training and Help</Link>,
];

const admin = [
  <Link className="link secondary-sidebar__link" to="/admin/create-project">Create project</Link>,
  <Link className="link secondary-sidebar__link" to="/view-projects">View projects</Link>,
  <Link className="link secondary-sidebar__link" to="/edit-profile">Edit profile</Link>,
  <Link className="link secondary-sidebar__link" to="/help">Training and Help</Link>,
];

const superadmin = [
  <Link className="link secondary-sidebar__link" to="/superadmin/create-project">Create project</Link>,
  <Link className="link secondary-sidebar__link" to="/view-projects">View projects</Link>,
  <Link className="link secondary-sidebar__link" to="/superadmin/manage-users">Manage users</Link>,
  <Link className="link secondary-sidebar__link" to="/superadmin/import-typology">Manage Typology</Link>,
  <Link className="link secondary-sidebar__link" to="/edit-profile">Edit profile</Link>,
  <Link className="link secondary-sidebar__link" to="/help">Training and Help</Link>,
];

const defaultLinks = [
  <Link className="link secondary-sidebar__link" to="/register">Register</Link>,
  <Link className="link secondary-sidebar__link" to="/login">Login</Link>,
];

export default {
  admin,
  superadmin,
  user,
  defaultLinks,
};
