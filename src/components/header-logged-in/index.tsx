import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link từ react-router-dom
import { Menu, Dropdown, Button } from "antd";
import {
  UserOutlined,
  NotificationOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  WalletOutlined,
  TransactionOutlined,
} from "@ant-design/icons"; // Import các icon từ Ant Design
import "./index.css"; // Import file CSS cho Header
import avatar from "../../images/avata.jpg"; // Thêm đường dẫn avatar
import { useDispatch } from "react-redux";
import { logout } from "../../redux/feature/userSlice";

const HeaderLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const role = "";
  const base_URL = "";
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/member-profile/personal">Personal</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<NotificationOutlined />}>
        <Link to="/notification">Notification</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<AppstoreOutlined />}>
        <Link to="/my-auction">My Auction</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<TransactionOutlined />}>
        <Link to="/payment-request">Payment Request</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<WalletOutlined />}>
        <Link to="/profile/wallet">Wallet</Link>
      </Menu.Item>
      <Menu.Item key="6" icon={<LogoutOutlined />} danger>
        <div
          onClick={() => {
            localStorage.removeItem("token");
            dispatch(logout());
            navigate("/");
            window.location.reload();
          }}
        >
          Log out
        </div>
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
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/auctions"}>Auctions</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            {/* Thay thế Login và Register bằng avatar với menu dropdown */}
            <Dropdown overlay={menu} trigger={["hover"]} placement="bottomRight">
              <div className="avatar-wrapper">
                <img src={avatar} alt="User Avatar" className="avatar" />
              </div>
            </Dropdown>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderLogin;
