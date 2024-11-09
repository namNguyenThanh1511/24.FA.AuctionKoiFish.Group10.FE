import React from "react";
import "./header.css"; // Import file CSS cho Header
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { Dropdown, Menu } from "antd";
import {
  UserOutlined,
  NotificationOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import avatar from "../../images/avata.jpg";
const Header = () => {
  const navigate = useNavigate(); // Khai báo useNavigate
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    console.log(token);
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/profile">Personal</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<NotificationOutlined />}>
        <Link to="/notification">Notification</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<AppstoreOutlined />}>
        <Link to="/my-auction">My Auction</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<LogoutOutlined />} danger>
        <Link to="/logout">Logout</Link>
      </Menu.Item>
    </Menu>
  );
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
            <Link to="/Introduction">Introduction</Link>
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
