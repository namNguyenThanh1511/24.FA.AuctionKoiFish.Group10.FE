// src/components/header-avatar-dropdown/header-avatar-dropdown-koibreeder.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { AppstoreOutlined, LogoutOutlined } from "@ant-design/icons";

const DropdownMenuKoiBreeder = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Menu>
      <Menu.Item key="1" icon={<AppstoreOutlined />}>
        <Link to="/koibreeder-profile/personal">Personal</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<AppstoreOutlined />}>
        <Link to="/koibreeder-profile/koiFish">My Koi</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<AppstoreOutlined />}>
        <Link to="/koibreeder-profile/auctionRequest">My Auction Request</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<AppstoreOutlined />}>
        <Link to="/koibreeder-profile/auctionRequest">My Wallet</Link>
      </Menu.Item>
      <Menu.Item
        key="5"
        icon={<LogoutOutlined />}
        danger
        onClick={handleLogout}
      >
        Log out
      </Menu.Item>
    </Menu>
  );
};

export default DropdownMenuKoiBreeder;
