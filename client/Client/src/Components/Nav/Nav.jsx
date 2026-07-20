import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import './Nav.css';

const Nav = () => {
  const nav = useNavigate();
  const { isAuthenticated, logoutUser } = useUser();

  const handleLogout = () => {
    axios({
      method: 'get',
      url: `${import.meta.env.VITE_API_URL}/api/users/logout`,
      withCredentials: true
    })
      .then(() => {
        logoutUser();
        nav('/login2');
      })
      .catch(error => {
        console.error('Logout failed:', error.message);
        logoutUser();
        nav('/login2');
      });
  };

  return (
    <nav aria-label="Main navigation">
      {isAuthenticated ? (
        <ul className="nav-list" role="list">
          <li>
            <Link to="/notes" aria-label="Go to create note page">Notes</Link>
          </li>
          <li>
            <Link to="/get" aria-label="Go to your notes">My Notes</Link>
          </li>
          <li>
            <Link to="/dash" aria-label="Go to dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/settings" aria-label="Go to settings">Settings</Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              aria-label="Log out of your account"
              className="nav-logout-btn"
            >
              Logout
            </button>
          </li>
        </ul>
      ) : (
        <ul className="nav-list" role="list">
          <li>
            <Link to="/login2" aria-label="Go to login page">Login</Link>
          </li>
          <li>
            <Link to="/reg" aria-label="Go to register page">Register</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Nav;
