import React from 'react';
import links from '../../links';

const Admin = () => (
  <div>
    <h2>Admin Dashboard</h2>
    <ul>
      {
        links.admin.map((link) => (
          <li>
            {link}
          </li>
        ))
      }
    </ul>
  </div>
);

export default Admin;
