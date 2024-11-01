// src/components/DropdownMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  WalletOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const DropdownMenuMember = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Điều hướng về trang chủ sau khi đăng xuất
  };

  return (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/member-profile/personal">Personal</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<AppstoreOutlined />}>
        <Link to="/member-profile/my-auction">My Auction</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<WalletOutlined />}>
        <Link to="/member-profile/wallet">Wallet</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<LogoutOutlined />} danger onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  );
};

export default DropdownMenuMember;
