import React from 'react';
import links from '../../links';

const User = () => (
  <div>
    <h2>User Dashboard</h2>
    <ul>
      {
        links.user.map((link) => (
          <li>
            {link}
          </li>
        ))
      }
    </ul>
  </div>
);

export default User;
