import React from 'react';
import links from '../../links';

const SuperAdmin = () => (
  <div>
    <h2>Superadmin Dashboard</h2>
    <ul>
      {
        links.superadmin.map((link) => (
          <li>
            {link}
          </li>
        ))
      }
    </ul>
  </div>
);

export default SuperAdmin;
