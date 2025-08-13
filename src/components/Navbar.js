import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Job Tracker
            </Link>
            <div className="navbar-links">
                <Link to="/" className="nav-link">
                    Dashboard
                </Link>
                <Link to="/add" className="nav-link">
                    Add Job
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;