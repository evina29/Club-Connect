import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar sidebar-navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/app">
            🏠<br/>Home
          </Link>
        </li>
        <li>
          <Link to="/clubs">
            🏫<br/>Clubs
          </Link>
        </li>
        <li>
          <Link to="/app/profile">
            👤<br/>Profile
          </Link>
        </li>
        <li>
          <Link to="/app/notifications">
            🔔<br/>Notifications
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;