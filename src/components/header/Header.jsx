import React from "react";
import "./header.css"; // Import file CSS cho Header
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate

const Header = () => {
  const navigate = useNavigate(); // Khai báo useNavigate

  return (
    <header className="header">
      <div className="logo">
        <h1>Auction Legend Koi</h1>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/auctions">Auctions</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <button className="btn-login" onClick={() => navigate("/login")}>
              Login
            </button>
          </li>
          <li>
            <button className="btn-register" onClick={() => navigate("/register")}>
              Register
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
