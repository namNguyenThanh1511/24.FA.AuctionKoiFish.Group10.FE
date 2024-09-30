import React from "react";
import "./header.css"; // Import file CSS cho Header
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Auction Legend Koi</h1> {/* Thay đổi tên thành "Auction Legend Koi" */}
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/auctions"}>Auctions</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
          <li>
            <Link to={"/register"}>Register</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
