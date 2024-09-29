import React from "react";
import "./header.css"; // Import file CSS cho Header

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Auction Legend Koi</h1>{" "}
        {/* Thay đổi tên thành "Auction Legend Koi" */}
      </div>
      <nav className="nav">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/auctions">Auctions</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/login" className="btn-login">
              Log in
            </a>
          </li>
          <li>
            <a href="/register" className="btn-register">
              Register
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
