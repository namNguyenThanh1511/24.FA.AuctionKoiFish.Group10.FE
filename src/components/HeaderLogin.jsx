import React from "react";
import "./headerlogin.css"; // Import file CSS cho Header
import avatar from "../images/avata.jpg"; // Thêm đường dẫn avatar

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Auction Legend Koi</h1>
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
            {/* Thay thế Login và Register bằng avatar */}
            <a href="/profile">
              <img
                src={avatar}
                alt="User Avatar"
                className="avatar"
                onClick={() => {
                  window.location.href = "/profile";
                }}
              />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
