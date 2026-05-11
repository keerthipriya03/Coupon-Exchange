// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Parse token from stored JSON object { token, user }
  const getUser = () => {
    try {
      const stored = localStorage.getItem("swapnsaveUser");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  };

  const userData = getUser();
  const isLoggedIn = !!userData?.token;

  const handleLogout = () => {
    localStorage.removeItem("swapnsaveUser");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top px-4">
      <Link className="navbar-brand fw-bold" to="/">SwapnSave</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/browse">Browse Coupons</Link></li>
          {isLoggedIn && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/add-listing">Add Listing</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/chat">Chat</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
            </>
          )}
        </ul>

        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <>
              <span className="text-light me-3">👋 {userData?.user?.name}</span>
              <button className="btn btn-danger mx-1" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light mx-1">Login</Link>
              <Link to="/signup" className="btn btn-warning mx-1">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;